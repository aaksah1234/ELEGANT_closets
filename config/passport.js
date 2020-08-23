const passport=require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy=require('passport-local').Strategy;
const conn=require('./connection');

module.exports=function(passport){

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    passport.serializeUser(function(user,done){
        done(null,user.id);
    });

    passport.deserializeUser(function(id,done){
        conn.query('SELECT *FROM user WHERE id=?',[id],function(err,rows){
            done(err,rows[0]);
        });
    });

    passport.use('local-signup',new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    },function(req,email,password,done){
        conn.query('SELECT * FROM user WHERE email=?',[email],function(err,rows){
            if(err){
                done(err);
            }
            else if(rows.length){
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            }
            else {

				// if there is no user with that email
                // create the user
                var newUserMysql = new Object();
				
				newUserMysql.email    = email;
                newUserMysql.password = bcrypt.hashSync(password, 10);  // use the generateHash function in our user model; // use the generateHash function in our user model
			
				var insertQuery = "INSERT INTO user ( email,name,password ) values (?,?,?)";
				console.log(insertQuery);
				conn.query(insertQuery,[newUserMysql.email,req.body.name,newUserMysql.password],function(err,rows){
                    if(err)
                     throw err;
                    newUserMysql.id = rows.insertId;        
                    return done(null, newUserMysql);
				});	
            }
        })
    })
    );
            
            // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },function(req, email, password, done) { // callback with email and password from our form
         conn.query("SELECT * FROM `user` WHERE `email` = '" + email + "'",function(err,rows){
			if (err){
                return done(err,false, req.flash('loginMessage', err));
            }    
			if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            } 
			
			// if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, rows[0].password)){
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
            }
            // all is well, return successful user
            return done(null, rows[0]);			
		});
    }));

}

