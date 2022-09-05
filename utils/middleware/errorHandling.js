const handleError = (err, req, res, next)=>{
   
    if(err.code===11000){
        res.status(400).json({
            message:"Username is already in use"
        })
    }
    else res.status(400).json({
        message:err.message
    })
}

module.exports = handleError