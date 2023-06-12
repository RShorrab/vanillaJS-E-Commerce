const joi = require('joi')

const signupValidation =
{
    body: joi.object().required().keys(
        {
            first_name: joi.string().min(3).max(50).required(),
            last_name: joi.string().min(3).max(50).required(),
            email: joi.string().email().required(),
            //password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
            password: joi.string().required()
        })
}
const signinValidation = 
{
    body: joi.object().required().keys(
        {
            email: joi.string().email().required(),
            //password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
            password: joi.string().required()
        })
}

module.exports = 
{
    signupValidation,
    signinValidation
}

