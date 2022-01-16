const express = require("express");
const router = express.Router();
const { getDoc, getFirestore, doc } = require("firebase/firestore");

router.get('/:id', async (req, res) => {

    const id = req.params.id;
    const docRef = doc(getFirestore(), "shopping-list", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const results = docSnap.data().results;
      res.send(results.map(product => ({ product: product.product, pricePerPerson: product.pricePerPerson, totalPrice: product.totalPrice })));
    } else {
      res.status(400).json({ message: `Einkaufsliste mit der ID " ${id} " wurde nicht gefunden!` });
    }
  

});

module.exports = router;