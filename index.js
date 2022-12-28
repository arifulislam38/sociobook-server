const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());







const uri = process.env.mongodb_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

// postcollection.find({}).sort({like : -1}).limit(3).toarray();

async function run(){
    try {
        const postCollection = client.db('socioBook').collection('post');


        app.post('/createpost', async(req,res)=>{
            try {
                const post = req.body;
                const result = await postCollection.insertOne(post);
                res.send({
                    success: true,
                    data: result
                })
            } catch (error) {
                res.send({
                success: false,
                message: error.message
                })
            }
        });

    } catch (error) {
        console.log(error.name, error.message)
    }
};
run()


app.get('/', async (req, res) => {
    res.send('socioBook server is running');
})

app.listen(port, () => console.log(`server is running on ${port}`));