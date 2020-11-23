const express=require('express');
const userRouter=express.Router();
const passport=require('passport');

module.exports=userRouter;

userRouter.get('/signup',(req,res,next)=>{
   res.render('signup',{ message: req.flash('signupMessage') });
});

userRouter.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/user/login', // redirect to the secure profile section
    failureRedirect : '/user/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

userRouter.get('/login',(req,res,next)=>{
    res.status(200).render('login',{ message: req.flash('loginMessage') });
});

userRouter.post('/login',passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/user/login', // redirect back to the signup page if there is an error
    failureFlash : true, // allow flash messages  
}));

userRouter.get('/logout',(req,res,next)=>{
    if(!req.user){
        res.status(500).send('you are not logged in !!!');
    }
    else{
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    }
});