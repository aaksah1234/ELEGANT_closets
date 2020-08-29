const express=require('express');
const meetingRouter=express.Router();
const conn=require('../config/connection');

module.exports=meetingRouter;

meetingRouter.get('/residential',(req,res,next)=>{
    res.render('booking/book',{category:'Residential'});
});
meetingRouter.get('/workspace',(req,res,next)=>{
    res.render('booking/book',{category:'WorkSpace'});
});
meetingRouter.get('/interior',(req,res,next)=>{
    res.render('booking/book',{category:'Interior'});
});

