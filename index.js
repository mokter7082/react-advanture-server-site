const express = require("express");
const cors = require("cors");
var ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
//CALL CORS
app.use(cors());
app.use(express.json());
//BASIC CONNECT WITH DATABASE
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ohgf7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//**** */
async function run() {
  await client.connect();
  //CONNECT DATABASE WITH MONGO DB
  const database = client.db("assignment");
  //CONNECT WITH TABLE
  const serviceCollection = database.collection("services");
  const orderCollection = database.collection("placeOrder");

  app.post("/addService", async (req, res) => {
    const serviceInfo = req.body;
    const result = await serviceCollection.insertOne(serviceInfo);
    res.send(result);
  });
  //GET REQUEST GET ALL service INFORMATION
  app.get("/allServices", async (req, res) => {
    const cursor = serviceCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
  });
  //GET REQUEST GET ALL order INFORMATION
  app.get("/palceOrder/:email", async (req, res) => {
    const result = await orderCollection
      .find({
        userEmail: req.params.email,
      })
      .toArray();
    res.send(result);
    // const result = await orderCollection.find({}).toArray();
    // res.send(result);
    // console.log(result);
  });
  //GET REQUEST GET ALL order INFORMATION
  app.get("/palceOrder", async (req, res) => {
    const result = await orderCollection.find({}).toArray();
    res.send(result);
    console.log(result);
  });
  //delete
  app.delete("/deleteOrder/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await orderCollection.deleteOne(query);
    res.json(result);
  });
  //UPDATE DATA FROM DATABASE
  app.put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const upData = req.body;
    const filter = { _id: ObjectId(id) };
    const updateDoc = {
      $set: {
        status: upData.status,
      },
    };
    const result = orderCollection.updateOne(filter, updateDoc);
    res.send(result);
  });
  //GET SINGLE MOBILE VALUE
  app.get("/service/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await serviceCollection.findOne(query);
    // console.log(result);
    res.send(result);
  });
  //post
  app.post("/placeOrder", async (req, res) => {
    // console.log(req.body);
    const result = await orderCollection.insertOne(req.body);
    // console.log(result);
    res.send(result);
  });

  //UPDATE DATA FROM DATABASE
  app.put("/service/:id", async (req, res) => {
    const id = req.params.id;
    const mobile = req.body;
    const filter = { _id: ObjectId(id) };
    const updateDoc = {
      $set: {
        mobileName: mobile.mobileName,
        mobileColor: mobile.mobileColor,
      },
    };
    const result = serviceCollection.updateOne(filter, updateDoc);
    res.send(result);

    console.log(mobile);
  });
}
run();
app.get("/", (req, res) => {
  res.send("Assignment 11 server is running");
});

app.listen(port, () => {
  console.log("my server is runniung Now", port);
});
