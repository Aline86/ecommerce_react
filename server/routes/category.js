const express = require('express')
const router = express.Router()

// middlewares
const {authCheck, adminCheck} = require('../middlewares/auth')
// controller 

const { create, read, update, remove, list, getSubs } = require("../controllers/category")
// route get the request send the response
// middleware to check if token is valid, info is passed to next function
// pour ajouter post pour lire get etc
router.post('/category', authCheck, adminCheck, create)
router.get('/categories', list)
router.get('/category/:slug', read)
router.put('/category/:slug', authCheck, adminCheck, update)
router.delete('/category/:slug', authCheck, adminCheck, remove)
router.get('/category/subs/:_id', getSubs)

module.exports = router