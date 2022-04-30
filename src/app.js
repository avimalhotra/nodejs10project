const express=require("express");
const path=require("path");
const nunjucks=require("nunjucks");
const app=express();
require('dotenv').config();
const mongoose=require('mongoose');
const dao=require('./dao');
const Car=require("./models/car");
const { log } = require("console");

app.use(express.static(path.resolve(__dirname,'public')));

// configure
nunjucks.configure(path.resolve(__dirname,'public'),{
     express:app,
     autoscape:true,
     noCache:false,
     watch:true
 });

 app.get("/",(req,res)=>{
     let cardata=[];
     let cars=Car.find({},'name',(err,data)=>{
         if( err){
            //cardata[0]={error:"error found"}
            res.status(200).render("home.html",{cars:err, name:"Home Page"})
         }
         else{
             res.status(200).render("home.html",{cars:data,name:"Home Page"})
           }
     });

     //res.status(200).render('home.html',{name:"nunjucks",version:'3.2.3',user:{name:"foo",id:12},month:["jan","feb","mar","apr"],city:"noida",cars:cardata});

 });
 app.get("/add",(req,res)=>{
    res.status(200).render('add.html',{name:"Add Car"});
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

 app.get("/product",(req,res)=>{
     res.status(200).render('product.html',{name:"Iphone 13"})
 })
 app.get("/**",(req,res)=>{
     res.status(200).render('error.html',{name:"404 - Page not found"})
 })

 app.listen(process.env.PORT,()=>{
     console.log(`App running at http://127.0.0.1:${process.env.PORT}`);
 });
