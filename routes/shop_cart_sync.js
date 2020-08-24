const express=require('express');
const cartRouter=express.Router();
const sync_sql=require('sync-sql');
const authenticate=require('../authenticate');

const conn = new sync_sql({ 
    host:'localhost', 
    user:'root', 
    password:'password', 
    database:'interior_design'
});

conn.connect((err)=>{
    if(!err){
        console.log('connected to database for sync!!');
    }
    else{
        console.log(err);
    }
});


module.exports=cartRouter;
