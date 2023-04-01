require ("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const Product = require("./models/products")

const app = express()
const PORT = process.env.PORT ;

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

app.use(express.urlencoded({extended:false}))
app.use(express.json())


app.get("/",(req,res) => {
    res.send("working");
})

// I for Index

app.get("/products", (req,res) => {
    res.render("index.ejs")
})
// N for New 
app.get("/new", (req,res) => {
    res.render("new.ejs")
})

// C for Create 
app.post("/new", (req,res) => {
    const product = new Product (req.body)
    product.save().then(res.send(product))
    res.redirect("show.ejs")
});


// S for show 
app.get("/productpage", (req,res) => {
    res.render("show.ejs")
})

app.listen(PORT, () => {
    console.log(`listening at  ${PORT}`)
})

