const express = require('express')
const server = express()

const products = {
    lidl: [
        {
            name: 'Brot',
            price: 2,
        },
        {
            name: 'Wasser',
            price: 1.5,
        },
        {
            name: 'Milch',
            price: 1,
        },
        {
            name: 'Fleisch',
            price: 5,
        },
        {
            name: 'Apfel',
            price: 1,
        },
    ],
    aldi: [
        {
            name: 'Brot',
            price: 1.5,
        },
        {
            name: 'Wasser',
            price: 1,
        },
        {
            name: 'Milch',
            price: 2,
        },
        {
            name: 'Fleisch',
            price: 6,
        },
        {
            name: 'Apfel',
            price: 0.5,
        },
    ]
}

server.get("/api/products",(request,response)=>{
    response.status(200).json(products)
})

server.listen(5000,function(){console.log("Server is running on Port 5000")}) 