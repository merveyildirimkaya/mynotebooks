const Language = require('../model/languageModel')

const getAllLanguages = async(req,res,next)=>{

    try {
        const languages = await Language.find({},'language')
        res.json(languages)
    } catch (error) {
        console.log(error)
    }
    
}

module.exports ={getAllLanguages}