// import express
const express = require('express');
const app = express();
// import body-parser to handle table
var bodyParser = require('body-parser')
// import cors
const cors = require('cors')

// global cors
app.use(cors())
// parse application extended=false value=str/array
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// router
const loginRouter = require('./router/login');
app.use('/api', loginRouter)

// bind host and port
app.listen(3000, () => {
    console.log('http://localhost:3000')
})