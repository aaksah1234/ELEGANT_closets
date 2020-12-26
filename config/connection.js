const mysql=require('mysql');

var conn;

conn=mysql.createConnection({
    //connectionLimit : 10,
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASS,
    database:process.env.DATABASE
});

conn.connect((err)=>{
    // if (err.fatal) {
    //     console.error('CONNECT FAILED FATAL: ', err.code,err);
    //     //startConnection();
    // }
    if (err) {
        console.error('CONNECT FAILED', err.code);
        //startConnection();
    }
    else
        console.error('CONNECTED to database');        
});


//startConnection();

// testing a select every 3 seconds :
// to try the code you can stop mysql service => select will fail
// if you start mysql service => connection will restart correctly => select will succeed
// setInterval(function() {
//     conn.query('select 1', function(err, results) {
//         if (err) console.log('SELECT', err.code);
//         else console.log('SELECT', results);
//     });
// }, 10000);

module.exports=conn;

