require('dotenv').config();
const express=require("express");
const path=require("path");
const nunjucks=require("nunjucks");
const app=express();
const session=require('express-session');
app.set('trust proxy', 1); 

app.use(session({
    secret:"session",
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))

const mongoose=require('mongoose');
const dao=require('./dao');
const Car=require("./models/car");
const Admin=require("./models/admin");

const bodyParser=require('body-parser'); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());  

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser( (user, done)=> {
    done(null, user.id);
  });
passport.deserializeUser( (user, next)=> {
    next(null, user);
});
passport.use( new LocalStrategy({ usernameField: 'name',passwordField:'pass' },(username, password, done) => {
    
    Admin.findOne({ name: username }, (err, user) => { 
       
      if (err) { return done(err); }
      if (!user) { return done(null, null, { message: 'No user found!' }); }
      if (user.pass !== password) {return done(null, null, { message: 'Username or password is incorrect!' }) }

      return done(null, user, null);
    });
  }
));
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(403).render('login.html',{msg:"Forbidden"});
    }
}


app.use(express.static(path.resolve(__dirname,'public')));

// configure
nunjucks.configure(path.resolve(__dirname,'public'),{
     express:app,
     autoscape:true,
     noCache:false,
     watch:true
 });

 app.get("/",(req,res)=>{
     Car.find({},'name',(err,data)=>{
         if( err){
            res.status(200).render("home.html",{cars:err, name:"Home Page"})
         }
         else{
             res.status(200).render("home.html",{cars:data,name:"Home Page"})
           }
     });
 });

app.get("/addcar",(req,res)=>{
    let carname=new Car({
        _id:mongoose.Types.ObjectId(),
        name:req.query.name,
        brand:req.query.brand,
        type:req.query.type,
        price:req.query.price,
        fuel:req.query.fuel
    });
    carname.save((err,data)=>{
        if(err){
            res.status(200).send(err);
        }
        else{
            res.status(200).send(data);
        }
    })
});
app.get("/all",(req,res)=>{
    res.status(200).render("all.html");
})

app.get("/api",(req,res)=>{
    Car.find({},{"_id":0,"__v":0},(err,data)=>{
        if( err){
           return res.status(200).send(err)
        }
        else{
            return res.status(200).send(data);
        }
    }).sort({name:1});
});

 app.get("/product",(req,res)=>{
     res.status(200).render('product.html',{name:"Iphone 13"})
 })

app.get("/add",(req,res)=>{
    res.status(200).render('add.html',{name:"Add Car"});
});
app.get("/login",(req,res)=>{
    res.status(200).render('login.html',{name:"Login"});
});

app.get('/adminlogin', isAuthenticated, (req, res) => {  res.render('admin-login.html',{name:"admin"}) });

app.get('/logout', (req, res) => { 
    if (req.session) {
        req.session.destroy((err)=> {
          if(err) {
            return next(err);
          } else {
              res.clearCookie('connect.sid');
              req.logout();
              if (!req.user) { 
                  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
              }
              res.render('login.html',{ msg:"Logout Successfully"});
          }
        });
      }
});
app.post("/login",(req,res)=>{
    passport.authenticate('local',  (err, user, info) =>{
        if (err) {
          res.render('login.html', { error: err });
        } 
        else if (!user) {
          res.render('login.html', { errorMessage: info.message });
        } 
        else {
          //setting users in session
          req.logIn(user, function (err) {
            if (err) {
              res.render('login.html', { error: err });
            } else {
              res.render('admin-login.html',{ name:user.name});
             }
          })
        }
      })(req, res);
});



 app.get("/**",(req,res)=>{
     res.status(404).render('error.html',{name:"404 - Page not found"})
 })

 app.listen(process.env.PORT,()=>{
     console.log(`App running at http://127.0.0.1:${process.env.PORT}`);
 });
