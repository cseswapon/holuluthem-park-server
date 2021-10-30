const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
const port = process.env.PORT || 4582;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ifldk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// mainly function
async function run() {
    try {
        await client.connect();
        console.log("Database Connect Successfully");
        const database = client.db("Hololu");
        const serviceCollection = database.collection("serviceCollection");
        const placeOrder = database.collection("order");
        // all data service
        app.get('/service', async (req, res) => {
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
        })
        app.post('/service', async (req, res) => {
            const data = req.body;
            // console.log(req.body);
            const result = await serviceCollection.insertOne(data);
            res.send(result);
        })
        // single data service
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const singleService = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(singleService);
            res.send(result);
        })
        // add order 
        app.post('/add', async (req, res) => {
            // console.log("Hitted Data", req.body);
            const data = req.body;
            const result = await placeOrder.insertOne(data);
            res.send(result);
        })
        // get order
        app.get('/add', async (req, res) => {
            const cursor = placeOrder.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        // delete order
        app.delete('/add/:id', async (req, res) => {
            console.log(req.params.id);
            const id = req.params.id;
            const singleDelete = { _id: ObjectId(id) }
            const result = await placeOrder.deleteOne(singleDelete)
            res.json(result); 
        })
    }
    finally {
        // await client.close();
    }
} run().catch(console.dir)

// text root
app.get('/', (req, res) => {
    console.log("Hello Assignments");
    res.send("I am active");
})

app.listen(port, () => {
    console.log("Running Port: " + port);
})