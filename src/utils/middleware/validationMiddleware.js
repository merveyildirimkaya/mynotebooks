const {body} = require('express-validator')

const validateNewPass = ()=>{
    return [
        body('password')
        .trim()
        .isLength({min: 6}).withMessage("Length must be more than 6")
        .isLength({max: 10}).withMessage("Length must be less than 10"),

        body('repeatpassword')
        .trim()
        .custom((value, {req})=>{
            if(value !== req.body.password) {
              
                throw new Error("Password is not confirmed")
            }
            else return true
        })
    ]
}

module.exports={validateNewPass}