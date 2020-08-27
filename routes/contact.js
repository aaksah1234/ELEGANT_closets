const express=require('express');
const contactRouter=express.Router(); 
const sqlite3=require('sqlite3');
const db=new sqlite3.Database(process.env.TEST_DATABASE||'./database.sqlite');

module.exports=contactRouter;


contactRouter.get('/contact',(req,res,next)=>{
    res.render('contact/contact',{message:req.flash('message')});
});

contactRouter.post('/',(req,res,next)=>{
    let obj=req.body;
    if(!obj.name||!obj.email||!obj.msg){
        res.status(400).send();
    }
    //console.log(req.body);
    else{
        db.run('INSERT INTO Messages (name,email,message) VALUES ($name,$email,$msg)',
        {
            $name:obj.name,
            $email:obj.email,
            $msg:obj.msg
        },function(err){
            if(err){
                next(err);
            }
            db.get('SELECT * FROM Messages WHERE id=$id',{$id:this.lastID},(err1,row)=>{
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