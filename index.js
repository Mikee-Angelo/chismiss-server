const express = require('express') 
const bodyParser = require('body-parser')
const { applicationDefault, initializeApp } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')
const app = express() 
const port = 3000

app.use(bodyParser.json())

initializeApp({ 
    credential: applicationDefault()
})

const allUsers = async (nextPageToken) => { 

    let result = await getAuth().listUsers(1000, nextPageToken); 

    return result.users; 
}

app.get('/', async (req, res) => {
    let users = await allUsers()
    
    res.send({
        'data': users
    })
}) 

app.listen(port, () => {
    console.log(port)
})