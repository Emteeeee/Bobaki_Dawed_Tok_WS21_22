//wird ein Server erstellt 
const express = require('express')
const app = express()
require('./database');

app.use(express.json()); // Damit man json format per request schicken kann
app.use('/einkaufsliste', require('./routes/shoppinglist'))

app.listen(4000, () => console.log('> Server is up and running on port : 4000'))
