


export const asyncHendeler=(fn)=>{
    return (req,res,next)=>{
     fn(req,res,next).catch(error=>{
        return next (new Error(error))
     })
    }
}

export const GlobalError=(err,req,res,next)=>{
    if(err){
        if(process.env.MOOD=="dev"){
            return res.status(err.cause||500).json({message:err.message,stack:err.stack})
        }
        return res.status(err.cause||500).json({message:err.message})
    }
}