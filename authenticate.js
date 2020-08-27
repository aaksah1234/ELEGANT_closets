const express=require('express');
module.exports=(req,res,next)=>{
    if(req.user){
        next();
    }
    else{
        console.log('you are not authenticated !!!');
        req.session.returnTo = req.originalUrl; 
        res.redirect('/user/login');
    }
}