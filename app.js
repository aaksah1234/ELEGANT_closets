if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express= require('express');
const app=express();
const bodyParser=require('body-parser');
const errorhandler=require('errorhandler');
const sqlite3=require('sqlite3');
const morgan = require('morgan');
const session=require('express-session');
const passport=require('passport');
const flash=require('connect-flash');

const db=new sqlite3.Database(process.env.TEST_DATABASE||'./database.sqlite');

const contactRouter=require('./routes/contact');
const shopRouter=require('./routes/shop');
const bookRouter=require('./routes/book');
const userRouter=require('./routes/user');

require('./config/passport')(passport);

app.use(session({
    name:'session-id',
    secret:'12345-67890',
    saveUninitialized:false,
    resave:false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



app.set('view engine','ejs');
app.set('views',__dirname+'/views');
// app.set('layout','layouts/layout');    
// app.use(expressLayouts);
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/user',userRouter);
app.use('/contact',contactRouter);
app.use('/shop',shopRouter);
app.use('/book',bookRouter);

app.use(errorhandler());

app.listen(process.env.PORT||4001,()=>{
    console.log('server running !!!');
});