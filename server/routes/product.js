const express = require('express')
const router = express.Router()

// middlewares
const {authCheck, adminCheck} = require('../middlewares/auth')

// controller 
const { create, listAll, remove, read, update, list, productsCount, productStar, listRelated, searchFilter } = require("../controllers/product")
// route get the request send the response
// middleware to check if token is valid, info is passed to next function
// pour ajouter post pour lire get etc
router.post('/product', authCheck, adminCheck, create)
router.get('/products/total', productsCount)
router.get('/products/:count', listAll) // products/100
router.delete('/product/:slug', authCheck, adminCheck, remove)
router.put('/product/:slug', authCheck, adminCheck, update)
router.get('/product/:slug', read)
router.post("/products/", list)
// rating
router.put("/product/star/:productId", authCheck, productStar)
router.get('/product/related/:productId', listRelated)
// search
router.post("/search/filters", searchFilter)
module.exports = router