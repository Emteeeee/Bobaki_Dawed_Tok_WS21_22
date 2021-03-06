const express = require("express");
const router = express.Router();
const fetchdata = require("node-fetch");
const { getDoc, getFirestore, doc, setDoc, deleteDoc } = require("firebase/firestore");

const uuid = () => {
  return '_' + Math.random().toString(36).substring(2, 9);
}

// Einkaufsliste erstellen
router.post("/", async (req, res) => {
  try {
    const products = req.body.products;
    if (!products || products?.length < 1 || !Array.isArray(products)) {
      return res.status(400).json({ message: 'Bitte wählen Sie Produkte aus.' });
    }
    // https://api-gdw-2122.herokuapp.com/api/products
    const data = await fetchdata(" https://api-gdw-2122.herokuapp.com/api/products");
    const dataToJson = await data.json();

    const aldiProducts = dataToJson.aldi;
    const lidlProducts = dataToJson.lidl;
    const results = [];
    for (let j = 0; j < products.length; j++) {
      let found = false;
      // Error handling
      if (products[j].amount < 1 || products[j].persons < 1) {
        return res.status(400).json({ message: 'Personenzahl oder Produktenzahl darf nicht weniger als 1 sein' });
      }

      for (let i = 0; i < aldiProducts.length; i++) {
        if (products[j].name === lidlProducts[i].name) {
          const aldiProduct = aldiProducts[i];
          const lidlProduct = lidlProducts[i];
          const cheapestPrice = aldiProduct.price < lidlProduct.price ? aldiProduct.price : lidlProduct.price;
          const totalPrice = cheapestPrice * products[j].amount;
          const pricePerPerson = totalPrice / products[j].persons;
          results.push({
            product: products[j].name,
            totalPrice,
            amount: products[j].amount,
            price: cheapestPrice,
            persons: products[j].persons,
            pricePerPerson: parseFloat(pricePerPerson.toFixed(2))
          });
          found = true;
          break;
        }
      }
      // Checken ob das Produkt (aldi oder lidl) verfügbar ist.
      if (!found) {
        return res.status(400).json({ message: `Produkt "${products[j].name}" ist leider nicht vorhanden. Bitte wählen Sie ein anders Produkt aus.` });
      }
    }

    const id = uuid();
    await setDoc(doc(getFirestore(), 'shopping-list', id), { results });
    res.json({
      id,
      results
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'internal server error' })
  }
});

router.patch('/', async (req, res) => {

  const { id, product } = req.body;
  const docRef = doc(getFirestore(), "shopping-list", id);
  try {
    const docSnap = await getDoc(docRef);
    const shoppingListProducts = docSnap.data().results;
    if (!docSnap.exists()) return res.status(400).json({ message: `Einkaufsliste mit der ID " ${id} " wurde nicht gefunden!` });
    if (!product) {
      return res.status(400).json({ message: 'Kein Produkt zum anpassen!' });
    }

    const productIndex = shoppingListProducts.findIndex(shoppingListProduct => shoppingListProduct.product === product.name);
    if (productIndex < 0) {
      return res.status(400).json({ message: 'Produktname ist falsch!' });
    }
    const { price } = shoppingListProducts[productIndex];
    const amount = product.amount || shoppingListProducts[productIndex].amount;
    const persons = product.persons || shoppingListProducts[productIndex].persons;
    const totalPrice = price * amount;
    const pricePerPerson = totalPrice / persons;

    shoppingListProducts[productIndex].totalPrice = totalPrice;
    shoppingListProducts[productIndex].pricePerPerson = pricePerPerson;
    shoppingListProducts[productIndex].amount = amount
    shoppingListProducts[productIndex].persons = persons
    await setDoc(docRef, { results: shoppingListProducts });
    res.send({ message: 'Die Einkaufsliste wurde erfolgreich geändert' })
  } catch (error) {
    console.log(error)
  }
});

router.get('/:id', async (req, res) => {

  const id = req.params.id;
  const docRef = doc(getFirestore(), "shopping-list", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const results = docSnap.data().results;
    res.send(results.map(product => ({ product: product.product, amount: product.amount, persons: product.persons })));
  } else {
    res.status(400).json({ message: `Einkaufsliste mit der ID " ${id} " wurde nicht gefunden!` });
  }

});

router.delete('/:id', async (req, res) => {

  const id = req.params.id;
  const docRef = doc(getFirestore(), "shopping-list", id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) return res.status(400).json({ message: `Einkaufsliste mit der ID " ${id} " wurde nicht gefunden!` });
  
  await deleteDoc(docRef);
  res.send({ message: "Einkaufsliste wurde entfernt!" })

});

module.exports = router;
