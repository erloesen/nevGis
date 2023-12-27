// import express
const express = require('express');
const app = express();
// import body-parser to handle table
var bodyParser = require('body-parser');
// import cors
const cors = require('cors');
const Joi = require('joi');

// global cors
app.use(cors())
// parse application extended=false value=str/array
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// handle error
app.use((req, res, next) => {
    // status=0 success status=1 fail
    res.cc = (err, status=1) => {
        res.send({
            status,
            // judge err is object or string
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

// import jwt, exclude interface doesnt need to be coded (login and register)
const jwtconfig = require('./jwt_config/index');
const {expressjwt:jwt} = require('express-jwt')
app.use(jwt({
    secret: jwtconfig.jwtSecretKey, algorithms:['HS256']
}).unless({
    path: [/^\/api\//]
}))

// router
const loginRouter = require('./router/login');
app.use('/api', loginRouter)

// send err if joi
app.use((req, res, next) => {
    if (err instanceof Joi.ValidationError) { return res.cc(err) }
})

// bind host and port
app.listen(3000, () => {
    console.log('http://localhost:3000')
})