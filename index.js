const express = require("express");
const app = express()
const mongodb =require('mongodb');
 require("dotenv").config()
const URL = process.env.LINK;
const DB = process.env.DB;
const mongoclient = new mongodb.MongoClient(URL)
const cors = require('cors');

app.use(express.json());

app.use(cors({
    // origin:"http://localhost:3001"
    origin:"https://transcendent-cocada-c82ed7.netlify.app"
}))


app.post("/Contacts",async(req,res)=>{
    try {
        const connection =await mongoclient.connect();
        const db = connection.db(DB);
        const contact =  await db.collection("contacts").insertOne(req.body);
        await connection.close();
        res.json(contact);

        
    } catch (error) {
        console.log(error);
        res.json({message:"something Went Wrong"});
    }
})



app.post("/Products",async(req,res)=>{
    try {
        const connection =await mongoclient.connect();
        const db = connection.db(DB);
        const Products =  await db.collection("products").insertOne(req.body);
        await connection.close();
        res.json(Products);

    
    } catch (error) {
        console.log(error);
        res.json({message:"something Went Wrong"});
    }
})


app.get("/ProductsList",async(req,res)=>{
    try {
        const connection =await mongoclient.connect();
        const db = connection.db(DB);
        const Products =  await db.collection("products").find({}).toArray();
        await connection.close();
        res.json(Products);

    
    } catch (error) {
        console.log(error);
        res.json({message:"something Went Wrong"});
    }
})


app.get("/Product/:id",async(req,res)=>{
    try {
        const connection =await mongoclient.connect();
        const db = connection.db(DB);
        const Products =  await db.collection("products").findOne({_id:mongodb.ObjectId(req.params.id)});
        await connection.close();
        res.json(Products);

    
    } catch (error) {
        console.log(error);
        res.json({message:"something Went Wrong"});
    }
})



app.post("/hours/:id",async(req,res)=>{
    try {
        const connection =await mongoclient.connect();
        const db = connection.db(DB);
        const Products =  await db.collection("products").findOne({_id:mongodb.ObjectId(req.params.id)});
        var date1 = new Date(req.body.startDate);
        console.log(req.body.startDate);
        var date2 = new Date(req.body.endDate);
        var hours = (date2-date1)/(1000*3600);
        res.json(hours)
      
        await connection.close();
    
    } catch (error) {
        console.log(error);
        res.json({message:"something Went Wrong"});
    }
})


app.listen(process.env.PORT || 3006);