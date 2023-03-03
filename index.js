const express = require('express');
const app = express()
const cors = require('cors');
const mongodb =require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
 require('dotenv').config()
const URL = process.env.LINK;
const DB = process.env.DB;
const jwt_secret = process.env.jwt_secret;
const mongoclient = new mongodb.MongoClient(URL)

app.use(express.json());

app.use(cors({
    // origin:"http://localhost:3000"
    origin:"https://equipment-rental-portal.netlify.app"
}))

app.get("/", function (req, res) {
    res.send("<h1>Equipment rental portal Project...</h1>");
  });

  app.post("/admin/register", async (req, res) => {
    try {
        const connection =await mongoclient.connect();
        const db = connection.db(DB);
  
      //hash the password
      var salt = await bcrypt.genSalt(10);
      var hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
  
      // Select Collection
      // Do operation (CRUD)
      await db.collection("admin").insertOne(req.body);
 
      res.json({ message: "Admin created Sucessfully" });

     // Close the connection
      await connection.close();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  app.post("/admin/login", async (req, res) => {
    try {
      // Connect the Database
      const connection = await mongoclient.connect();
  
      // Select the DB
      const db = connection.db(DB);
  
      // Select Collection
      // Do operation (CRUD)
      const admin = await db
        .collection("admin")
        .findOne({ email: req.body.email });
      if (admin) {
        const compare = await bcrypt.compare(req.body.password, admin.password);
        if (compare) {
          //issue token
          const token = jwt.sign({ _id: admin._id }, jwt_secret, {
            expiresIn: "3m",
          });
    
          res.json({ message: "Success", token });
        } else {
          res.json({ message: "Incorrect email/password" });
        }
      } else {
        res.status(404).json({ message: "Incorrect email/password" });
      }
  
      // Close the connection
      await connection.close();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
  
  
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
        res.json(Products);
        await connection.close();
    
    } catch (error) {
        console.log(error);
        res.json({message:"something Went Wrong"});
    }
})
app.get("/Products",async(req,res)=>{
    try {
        const connection =await mongoclient.connect();
        const db = connection.db(DB);
        const Products =  await db.collection("products").find({}).toArray();
        res.json(Products);
        await connection.close();

    
    } catch (error) {
        console.log(error);
        res.json({message:"something Went Wrong"});
    }
})

app.get("/Products/:id", async (req, res) => {
  try {
    const connection = await mongoclient.connect();

    const db = connection.db(DB);
    const product = await db
      .collection("products")
      .findOne({ _id: mongodb.ObjectId(req.params.productId) });



    if (product) {
      res.json(product);
      await connection.close();
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.delete("/Products/:id",async(req,res)=>{
    try {
        const connection =await mongoclient.connect();
        const db = connection.db(DB);
        const productData = await db
        .collection("products")
        .findOne({ _id: mongodb.ObjectId(req.params.id) });
        res.json(productData);
        if (productData) {
            const product = await db
              .collection("products")
              .deleteOne({ _id: mongodb.ObjectId(req.params.id) }); 
              res.json(product);
              await connection.close();
          } else {
            res.status(404).json({ message: "Product not found" });
          }
    
    } catch (error) {
        console.log(error);
        res.json({message:"something Went Wrong"});
    }
})
// app.get("/ProductsList",async(req,res)=>{
//     try {
//         const connection =await mongoclient.connect();
//         const db = connection.db(DB);
//         const Products =  await db.collection("products").find({}).toArray();
//         res.json(Products);
//         await connection.close();

    
//     } catch (error) {
//         console.log(error);
//         res.json({message:"something Went Wrong"});
//     }
// })


app.get("/Product/:id",async(req,res)=>{
    try {
        const connection =await mongoclient.connect();
        const db = connection.db(DB);
        const Products =  await db.collection("products").findOne({_id:mongodb.ObjectId(req.params.id)}); 
        res.json(Products);
        await connection.close();
    
    } catch (error) {
        console.log(error);
        res.json({message:"something Went Wrong"});
    }
})

app.put("/Products/:id", async (req, res) => {
  try {
    const connection = await mongoclient.connect();
    const db = connection.db(DB);
    const productData = await db
      .collection("products")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });

    if (productData) {
      delete req.body._id;
      const product = await db
        .collection("products")
        .updateOne(
          { _id: mongodb.ObjectId(req.params.id) },
          { $set: req.body }
        );
      res.json(product);
      await connection.close();
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }

});

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
        res.json({message:"Something Went Wrong"});
    }
})


app.listen(process.env.PORT || 3006);