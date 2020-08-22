const mysql=require('mysql');
var conn=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"password",
    database:"interior_design"
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