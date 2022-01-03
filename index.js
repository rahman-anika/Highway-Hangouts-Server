const express = require('express');
const app = express();
const cors = require('cors');
const admin = require("firebase-admin");
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

// const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);



// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qcqim.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });





async function verifyToken(req, res, next) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decodedUser = await admin.auth().verifyIdToken(token);
            req.decodedEmail = decodedUser.email;
        }
        catch {

        }

    }
    next();
}








async function run() {
    try {
        await client.connect();
        const database = client.db('highwayHangouts');


        const usersCollection = database.collection('users');
        const chefsCollection = database.collection('chefs');
        const menuCollection = database.collection('menu');
        const recipesCollection = database.collection("recipes");
        const reviewCollection = database.collection("review");












    }


    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Highway Hangouts!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})