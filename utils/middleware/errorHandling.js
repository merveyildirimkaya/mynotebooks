const handleError = (err, req, res, next)=>{
    if(err.code===11000){
        res.json({
            statusCode:11000,
            message:"Credential is already in use"
        })
    }
    else res.json({
        message:err.message
    })
}

module.exports = handleError