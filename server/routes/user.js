const express = require('express')

const router = express.Router()

// route get the request send the response
router.get('/user', (req, res) => {
    res.json({
        data: "hey you hit node user API endpoint",
    })
})

module.exports = router