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





async function verifyToken (req, res, next)
{
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








async function run ()
{
    try {
        await client.connect();
        const database = client.db('highwayHangouts');


        const usersCollection = database.collection('users');
        const chefsCollection = database.collection('chefs');
        const menuCollection = database.collection('menu');
        const recipesCollection = database.collection("recipes");
        const reviewCollection = database.collection("review");
        const bookingCollection = database.collection("booking");


        // Get all chefs
        app.get("/allChefs", async (req, res) =>
        {
            const result = await chefsCollection.find({}).toArray();
            res.send(result);
        });


        app.get('/booking', async (req, res) =>
        {
            const cursor = bookingCollection.find({});
            const booking = await cursor.toArray();
            res.send(booking);
        });

        app.post('/booking', async (req, res) =>
        {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.json(result);
        });

        app.get('/booking/:email', async (req, res) =>
        {
            const email = req.params.email;
            const query = { booking_email: { $eq: email } };
            const cursor = bookingCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.put('/booking/:id', async (req, res) =>
        {
            const id = req.params.id;
            const updateStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateStatus.status
                }
            };
            const result = await bookingCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.delete('/booking/:id', async (req, res) =>
        {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
        });



    }


    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) =>
{
    res.send('Hello from Highway Hangouts server!')
})

app.listen(port, () =>
{
    console.log(`listening at ${port}`)
})