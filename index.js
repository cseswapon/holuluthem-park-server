const { MongoClient } = require('mongodb');
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
        const serviceCollection = database.collection("serviceCollection")
        app.get('/service', async (req, res) => {
            const cursor = serviceCollection.find({});
            const result = await cursor.toArray();
            res.send(result)
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