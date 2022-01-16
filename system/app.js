const express = require('express')
const app = express()
require('./database');
const port = process.env.PORT || 4000

app.use(express.json()); // Damit man json format per request schicken kann
app.use('/einkaufsliste', require('./routes/shoppinglist'))
app.use('/rechnung', require('./routes/rechnung'))

app.listen(port, () => console.log('> Server is up and running on port : 4000'))
