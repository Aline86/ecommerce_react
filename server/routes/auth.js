const express = require('express')

const router = express.Router()

// middlewares
const {authCheck, adminCheck} = require('../middlewares/auth')
// controller 

const { createOrUpdateUser, currentUser } = require("../controllers/auth")
// route get the request send the response
// middleware to check if token is valid, info is passed to next function

router.post('/create-or-update-user', authCheck, createOrUpdateUser)
router.post('/current-user', authCheck, currentUser)
router.post('/current-admin', authCheck, adminCheck, currentUser)

module.exports = router