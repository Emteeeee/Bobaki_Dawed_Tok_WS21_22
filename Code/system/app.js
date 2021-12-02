const express = require('express')
const app = express()

const fetchdata = require('node-fetch');


app.get('/supermarkt/aldi' , (req , response)=>{

    fetchdata('http://localhost:5000/api/aldi')
    .then(res => res.json())
    .then(apidata => response.json(apidata));



})



app.listen(3000, ()=> console.log('> Server is up and running on port : 3000'))
