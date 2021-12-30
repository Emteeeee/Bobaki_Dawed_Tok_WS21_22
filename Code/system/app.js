//wird ein Server erstellt 
const express = require('express')
const app = express()
const {getDocs, collection, getFirestore} = require("firebase/firestore")
const {initializeApp} = require ("firebase/app")
const firebaseConfig = {
    apiKey: "AIzaSyDiwtqRdmcPzKshvPZghUWtSRB1mzPLlus",
    authDomain: "grocery-management-62504.firebaseapp.com",
    projectId: "grocery-management-62504",
    storageBucket: "grocery-management-62504.appspot.com",
    messagingSenderId: "772828879400",
    appId: "1:772828879400:web:c716baf7040e64b67a731d",
    measurementId: "G-0FVTV91NVJ"
  };
  initializeApp(firebaseConfig); 


app.use(express.json());
app.use('/einkaufsliste', require('./routes/shoppinglist'))
app.get('/' , (req , response)=>{
    getDocs(collection(getFirestore(),"einkauflistenID")).then(query => query.forEach(doc => {console.log(doc.data())}))
})

app.listen(3000, ()=> console.log('> Server is up and running on port : 3000'))
