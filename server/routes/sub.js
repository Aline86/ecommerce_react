const express = require('express')

const router = express.Router()

// middlewares
const {authCheck, adminCheck} = require('../middlewares/auth')
// controller 

const { create, read, update, remove, list, findSubsById } = require("../controllers/sub")
// route get the request send the response
// middleware to check if token is valid, info is passed to next function
// pour ajouter post pour lire get etc
router.post('/sub', authCheck, adminCheck, create)
router.get('/subs', list)
router.get('/sub/:slug', read)
router.get('/subs/:parent', findSubsById)
router.put('/sub/:slug', authCheck, adminCheck, update)
router.delete('/sub/:slug', authCheck, adminCheck, remove)

module.exports = router