const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 4000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ombc1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    await client.connect();

    //collections
    const userCollection = client.db("shihabstutorial").collection("users");

    // apis
    // get all users
    app.get("/users", async (req, res) => {
      const users = await userCollection.find({}).toArray();
      res.send(users);
    });
    // get one user
    app.get("/user/:regnum", async (req, res) => {
      const regnum = req.params.regnum;
      const regnumToNumber = Number(regnum);
      const user = await userCollection.findOne({
        registrationNumber: regnumToNumber,
      });
      res.send(user);
    });
    // get one user by id
    app.get("/user-by-id/:id", async (req, res) => {
      const user = await userCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(user);
    });
    // add user
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    //update user
    app.put("/update-user/:id", async (req, res) => {
      const user = req.body;
      const filter = { _id: new ObjectId(req.params.id) };
      const updatedDoc = {
        $set: user,
      };
      const options = { upsert: true };
      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    console.log("Connected");
  } finally {
  }
};

run().catch(console.dir);
app.listen(port, () => console.log(`Listening on port ${port}`));
