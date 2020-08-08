const express= require('express');
const app=express();
const bodyParser=require('body-parser');
const errorhandler=require('errorhandler');
const sqlite3=require('sqlite3');
const db=new sqlite3.Database(process.env.TEST_DATABASE||'./database.sqlite');

app.set('view engine','ejs');
app.set('views',__dirname+'/views');
// app.set('layout','layouts/layout');    
// app.use(expressLayouts);
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:true}));

app.get('/contact',(req,res,next)=>{
    db.all('SELECT * FROM Messages',(err,rows)=>{
        res.render('all_mails',{contacts:rows});
    });
});

app.post('/contact',(req,res,next)=>{
    let obj=req.body;
    if(!obj.name||!obj.email||!obj.msg){
        res.render('success',{msg:'all fields are required !!!'});
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
            db.get('SELECT * FROM Messages WHERE id=$id',{$id:this.lastID},(err,row)=>{
                res.render('success',{msg:'Your message is successfully sent ! '});
                //res.status(201).json({contact:row});
            });
        });
    }

});

app.use(errorhandler());

app.listen(process.env.PORT||4001,()=>{
    console.log('server running !!!');
});