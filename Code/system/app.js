const express = require('express')
const app = express()

const fetchdata = require('node-fetch');


app.get('/' , (req , res)=>{

    fetchdata('http://localhost:5000/api/aldi')
    .then(res => res.text())
    .then(text => console.log(text));

   res.send('hello from simple server :)')


})



app.listen(3000, ()=> console.log('> Server is up and running on port : 3000'))