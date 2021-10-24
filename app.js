const products = [{ id: 1, img: "./images/AppleiPhoneXR.jpg", name: "Apple iPhone XR 64GB Retina Display", price: 599, }, { id: 2, img: "./images/GalaxyS21Ultra.jpg", name: "Samsung Galaxy S21 Ultra 256GB", price: 1649, }, { id: 3, img: "./images/SamsungGalaxyA22.jpg", name: "Samsung Galaxy A22 128GB 5G", price: 599, }, { id: 4, img: "./images/HPLaptop.jpg", name: "HP Laptop 13\" Core i5, 8GB RAM, 128GB HDD", price: 1099, }, { id: 5, img: "./images/iMac.jpg", name: "Apple iMac Retina 5K 27-inch 3.8GHz 512GB ", price: 3449, }, { id: 6, img: "./images/iPad.jpg", name: "Apple iPad Pro 11-inch 128GB Wi-Fi", price: 1199, }, { id: 7, img: "./images/AppleWatch.jpg", name: "Apple Watch Series 3 38mm Space Grey ", price: 299, }, { id: 8, img: "./images/OpelMobile.jpg", name: "Opel Mobile 4G EasySmart 2 Phone", price: 149, },]

const express = require('express')
const cors = require('cors')


const app = express()
const port = 3000
const productCatalogManagerModule = require('./js/cart/productCatalogManager')
const prodCatalogManager = new productCatalogManagerModule(products);
const cartManagerModule = require('./js/cart/cartManager')
const cartManager = new cartManagerModule();
const priceCalculatorModule = require('./js/cart/priceCalculator')
const priceCalculator = new priceCalculatorModule(prodCatalogManager, cartManager);

app.use(function(req, res, next){
	var ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
	console.log(`${new Date().toLocaleString()} : ${ip} : ${req.originalUrl}`)
	next()	
},express.static('public'))
app.use(express.json())
app.use(cors({ origin: "*" }))

app.get('/products', (req, res) => {
	var ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
	console.log(`${new Date().toLocaleString()} : ${ip}`)
    res.send(prodCatalogManager.getProducts(req.query.keyword))
})
app.get('/products/:id', (req, res) => {
    res.send(prodCatalogManager.getProduct(req.params.id))
})
app.delete('/cart/:id', (req, res) => {
    res.send(cartManager.deleteCartItem(req.params.id))
})
app.post('/cart', (req, res) => {
    const id = req.body.id; 
    const qty = req.body.qty; 
    cartManager.updateCartItem(id, qty)
    res.send('Cart updated')
});

app.get('/cartsummary', (req, res) => {
    res.send(priceCalculator.calculateTotalPrice())
})

app.listen(port,
    () => { console.log(`Example app listening at http://localhost:${port}`) })
