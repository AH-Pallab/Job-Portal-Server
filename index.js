const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.iclhmml.mongodb.net/?appName=Cluster0`;

const app = express();
const port = process.env.port || 3000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Job server is ready.");
});

app.listen(port, () => {
  console.log(`Job server is running on port: ${port}`);
});

async function run() {
  console.log("Pinged your deployment. You successfully connected to MongoDB!");

  const jobCollections = client.db("jobDob").collection("jobs");
  const applicationCollections = client.db("jobApplications").collection("applications");

  app.get("/users", async (req, res) => {
    const cursor = jobCollections.find();
    const result = await cursor.toArray();
    res.send(result);
  });

  app.get("/users/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await jobCollections.findOne(query);
    res.send(result);
  });

  //applications
  app.post('/applications',async(req,res)=>{
    const application = req.body;
    console.log("application: ",application);
    const result = await applicationCollections.insertOne(application);
    res.send(result);
  })
  app.get("/applications",async(req,res)=>{
    const cursor = applicationCollections.find();
    const result = await cursor.toArray();
    res.send(result);
  })
  
}
run();
