const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, CURSOR_FLAGS } = require('mongodb');
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
        const userCollection = client.db('socioBook').collection('users');


        app.post('/createuser', async(req, res)=>{
            try {
                const data = req.body;
                const result = await userCollection.insertOne(data);
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


        app.get('/user', async(req, res)=>{
            try {
                const email = req.query.email;
                const query = {email};
                const result = await userCollection.findOne(query);
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


        app.patch('/user', async(req,res)=>{
            try {
                const email = req.query.email;
                const data = req.body;
                const filter = {email};
                const options = { upsert: true };
                const updateDoc = {
                    $set:{
                        name: data.name,
                        address: data.address,
                        university: data.university
                    }
                }
                const result = await userCollection.updateOne(filter,updateDoc,options);
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


        app.get('/posts', async(req,res)=>{
            try {
                const result = await postCollection.find({}).sort({like: 1}).limit(3).toArray();
                res.send({
                    success: true,
                    data: result
                })
            } catch (error) {
                res.send({
                    success: false,
                    message: error.message
                });
            }
        });


        app.get('/allposts', async(req,res)=>{
            try {
                const result = await postCollection.find({}).toArray();
                res.send({
                    success: true,
                    data: result
                })
            } catch (error) {
                res.send({
                    success: false,
                    message: error.message
                });
            }
        });


        app.get('/post/:id', async(req,res)=>{
            try {
                const id = req.params.id;
                const result = await postCollection.findOne({_id: ObjectId(id)});
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


        app.post('/like', async(req, res)=>{
            try {
                const email = req.query.email;
            const id = req.query.id;
            const query = {_id: ObjectId(id)};
            const result = await postCollection.findOne(query);
            const like = result.likes.indexOf(email);
            console.log(like)
            if(like < 0){
                result.likes.push(email);
                const filter = { _id: ObjectId(id) };
                const options = { upsert: true };
                const updateDoc = {
                    $set: {
                        likes: result.likes
                    }
                };
                const data = await postCollection.updateOne(filter, updateDoc, options);
                console.log( result.likes);
                res.send({
                    data: 'liked'
                });
                return;
            };

            
            result.likes.pop(email);
            const filter = { _id: ObjectId(id) };
                const options = { upsert: true };
                const updateDoc = {
                    $set: {
                        likes: result.likes
                    }
                };
                const data = await postCollection.updateOne(filter, updateDoc, options);
            res.send({
                data: 'like'
            });

            } catch (error) {
                res.send({
                    success: false,
                    message: error.message
                });
            }           
        });


        app.patch('/comment', async(req, res)=>{
            try {
                const id = req.query.id;
                const data = req.body;
                const filter = {_id: ObjectId(id)};
                const fdata = await postCollection.findOne(filter);
                fdata.comments.push(data);
                const options = { upsert: true };
                const updateDoc = {
                $set:{
                    comments: fdata.comments
                }
                };
                const result = await postCollection.updateOne(filter, updateDoc, options);
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