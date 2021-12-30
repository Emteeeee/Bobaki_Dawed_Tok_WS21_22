const express = require("express");
const router = express.Router();
const fetchdata = require("node-fetch");

router.post("/", async (req, res) => {
  try {
    const products = req.body.products;
    const data = await fetchdata("http://localhost:5500/api/products");
    const dataToJson = await data.json();
  
    const aldiProducts = dataToJson.aldi;
    const lidlProducts = dataToJson.lidl;
    const foundProducts = [];
  
    products.forEach((product) => {
      for (let i = 0; i < aldiProducts.length; i++) {
        const element = aldiProducts[i];
        if (product === lidlProducts[i].name) {
            const aldiProduct = aldiProducts[i]
            const lidlProduct = lidlProducts[i]
            foundProducts.push({
                productName: product,
                priceAldi: aldiProduct.price,
                priceLidl: lidlProduct.price
            })
            break;
        }
      }
    });
    res.json(foundProducts);
  } catch (error) {
      console.log(error)
      res.status(500).json({message: 'internal server error'})
  } 
});

module.exports = router;
