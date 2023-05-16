const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});

async function dbConnect() {
  try {
    await client.connect();
    console.log("Database Connected");
  }
  catch (error) {
    console.log(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  }
}

dbConnect();

const MEDICINES = client.db("ecom").collection("medicine");

app.get("/medicine", async (req, res) => {
  try {
    const cursor = MEDICINES.find({});
    const medicine = await cursor.toArray();

    res.send({
      success: true,
      data: medicine,
    });
  }
  catch (error) {
    res.send({
      success: false,
      data: error.message,
    })
  }
})

app.get("/medicine/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await MEDICINES.findOne({ _id: new ObjectId(`${id}`) });

    res.send({
      success: true,
      data: result,
    });
  }
  catch (error) {
    res.send({
      success: false,
      data: error.message,
    })
  }
})

app.post("/medicine", async (req, res) => {
  try {
    const classroom = req.body;
    const result = await MEDICINES.insertOne(classroom);

    res.send({
      success: true,
      data: result,
    });
  }
  catch (error) {
    res.send({
      success: false,
      data: error.message,
    })
  }
})

app.put("/medicine/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await MEDICINES.updateOne(
      { _id: new ObjectId(`${id}`) },
      {
        $set: data
      }
    )

    res.send({
      success: true,
      data: result
    })
  }
  catch (error) {
    res.send({
      success: false,
      data: error.message,
    })
  }
})

app.get('/', async (req, res) => {
  res.send("ecom running")
})

app.listen(port, () => {
  console.log(`ecom running on port ${port}`)
})

