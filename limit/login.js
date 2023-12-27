// import joi
const joi = require('joi');

const account = joi.string().alphanum().min(6).max(20).required();
// only accept num and A-Za-z
const password = joi.string().pattern(/^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z0-9]{6,20}$/).required();

exports.login_limit = {
    body: {
        account,
        password
    }
}