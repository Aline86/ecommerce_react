const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
// gives u access to file system
const {readdirSync} = require("fs")
// package qui permet d'accéder aux variables du .env
require('dotenv').config()

// app
// function qui crée le server
const app = express()

//db connexion to mongodb database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('DB CONNECTED'))
.catch(err => console.log(`DB CONNECTION ERR ${err}`))


//import routes
const authRoutes = require('./routes/auth')

// middlewares

app.use(morgan("dev"))
app.use(bodyParser.json({limit: "2mb"}))
app.use(cors())

// routes middleware goes and fetch data in routes folder and find each route and connects it to the middlewares 
// route autoload function
// tout est automatiqé, pas besoin de les ajouter
readdirSync('./routes').map((r) => app.use("/api", require("./routes/" + r)))
// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`))