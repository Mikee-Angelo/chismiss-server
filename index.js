require('dotenv').config()

const express = require('express') 
const bodyParser = require('body-parser')
const { applicationDefault, initializeApp } = require('firebase-admin/app')
const { getAuth } = require('firebase-admin/auth')
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const { customAlphabet } = require('nanoid')
const app = express() 

app.use(express.urlencoded({extended: true}))
app.use(express.json())

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

app.get('/connect/:uid', async (req, res) => { 

    if(!req.params.uid || req.params.uid === '') return res.status(500).json({ 'error' : 'UID is required'})

    let users = await allUsers();

    let cooked = users.filter((value, index, array) => { 
        return value.uid != req.params.uid
    })

    let publisher = cooked[Math.floor(Math.random() * cooked.length )];
    let id = customAlphabet('1234567890', 9)()

    let token = RtcTokenBuilder.buildTokenWithUid(process.env.APP_ID, process.env.APP_CERTIFICATE, id, req.params.uid)

    res.send({ 
        'token': token, 
        'channelId': publisher.uid,
        'id': id,
    })

})

app.listen(process.env.PORT, () => {
    console.log(process.env.PORT)
})