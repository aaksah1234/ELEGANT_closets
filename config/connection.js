const mysql=require('mysql');
var conn=mysql.createPool({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASS,
    database:process.env.DATABASE
});

conn.connect((err)=>{
    if(!err){
        console.log('connected to database!!');
    }
    else{
        console.log(err);
    }
});

module.exports=conn;