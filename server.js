

require ("dotenv").config()


const express = require("express")

const mongoose = require("mongoose")

const Product = require("./models/products")


const methodOverride = require("method-override")
const User = require("./models/user")



const app = express()

const PORT = process.env.PORT ;

mongoose.connect(process.env.DATABASE_URL)

const db = mongoose.connection

db.on('error', (err) => console.log(' is mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));



app.use(express.urlencoded({extended:false}))



app.use(express.json())



app.use(methodOverride("_method"))



app.use("/public", express.static('public'));



app.get("/",(req,res) => {
    res.send("working");
})


// I for Index
// mongoose route to render index.js / 

app.get('/products', async (req, res) => {
    const allProducts = await Product.find({})

    res.render('index.ejs', {

    products: allProducts
   
})
})

// N for New 

app.get("/new", (req,res) => {
    res.render("new.ejs")
})


//D for delete

app.delete('/products/:id', async (req, res) => {
 
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products")
})

// app.delete('/cart', async (req, res) => {
 
//     await Product.findByIdAndDelete(req.params.id);
//     res.redirect("/cart")
// })

// U for update

app.put('/products/:id', async (req, res) => {
    await Product.findByIdAndUpdate(
        req.params.id,
        req.body,    
        {new:true}
    );
    res.redirect(`/products/${req.params.id}`)

    
});

app.get('/products/:id/edit', async (req, res) => {
    const product = await Product.findById(
        req.params.id,
    );
    res.render("edit.ejs", {product})
});


app.post("/products/:id/buy", async (req, res,next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).send("Product not found");
      }
      if (product.qty <= 0) {
        return res.status(400).send("Product out of stock");
      }
      product.qty -= 1;
      await product.save();
      
      // Update user's shopping cart with the bought product
      const user = await User.findOne({});
      user.shopping_cart.push(product);
      await user.save();
  
      res.redirect("/cart");

    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  });


// C for Create 
 app.post("/new", (req,res) => {
    const product = new Product (req.body)
    product.save().then(res.redirect("/products"))
    
});

// app.post("/cart", async (req,res) => {
//     const user = await User.findOne({});
    
// });



// S for show 
app.get("/productpage", (req,res) => {
    res.render("show.ejs")
})

app.get("/cart", async (req,res) => {
    const user = await User.findOne({});
    res.render("cart.ejs", {
        cart: user.shopping_cart
    })
})

app.get('/products/:id', async (req, res) => {
    
        const foundProduct = await Product.findById(req.params.id).exec()
        res.render('show.ejs', {
            product: foundProduct,

            
        });
    
    
});


app.listen(PORT, () => {
    console.log(`listening at  ${PORT}`)
})

