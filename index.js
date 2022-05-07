const express = require('express') 
const bodyParser = require('body-parser')
const { initializeApp } = require('firebase-admin/app')
const app = express() 
const port = 3000

app.use(express.json()) 
app.use(bodyParser.json())

app.get('/', (req, res) => {

    
    res.send({
        message: 'Hello World'
    })
}) 

app.listen(port, () => {
    console.log(port)
})