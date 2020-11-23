const express=require('express');
const contactRouter=express.Router(); 
const conn = require('../config/connection');
let authenticate = require('../authenticate');
const sqlite3=require('sqlite3');
const db=new sqlite3.Database(process.env.TEST_DATABASE||'./database.sqlite');

module.exports=contactRouter;


contactRouter.get('/contact',(req,res,next)=>{
    res.render('contact/contact',{message:req.flash('message')});
});

contactRouter.post('/',authenticate,(req,res,next)=>{
    let obj=req.body;
    if(!obj.msg){
        res.status(400).send();
    }
    //console.log(req.body);
    else{
        conn.query('INSERT INTO messages (user_id,message) VALUES (?,?)',
        [req.user.id,obj.msg],function(err){
            if(err){
                next(err);
            }
            conn.query('SELECT * FROM messages WHERE id=?',[this.lastID],(err1,row)=>{
                if(err1){
                    next(err1);
                }
                req.flash('message','Your message is successfully sent !!!');
                res.render('contact/contact',{message:req.flash('message')});
                //res.status(201).json({contact:row});
            });
        });
    }

});