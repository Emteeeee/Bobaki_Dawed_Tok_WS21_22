//wird ein Server erstellt 
const express = require('express')
const port = process.env.PORT || 4000
const app = express()
require('./database');

app.use(express.json()); // Damit man json format per request schicken kann
app.use('/einkaufsliste', require('./routes/shoppinglist'))

app.listen(port, () => console.log('> Server is up and running on port : 4000'))
