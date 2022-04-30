const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/node', {useNewUrlParser: true, useUnifiedTopology: true});

const db=mongoose.connection;
const Schema=mongoose.Schema;

const Car=new Schema({
    _id:mongoose.ObjectId,
    name:{ type:String, required:true, unique:true, dropDups:true },
    brand:{ type: String, required: true },
    type:{ type: String, required: true },
    price:{ type: Number, required: true },
    fuel:{ type: String, required: true }
},{collection:"cars"});

let model=mongoose.model("model",Car);

let car=new model({
    _id:new mongoose.Types.ObjectId(),
    name:"altroz",
    brand:"Tata",
    type:"hatchback",
    price:700000,
    fuel:"petrol"
});


//const User=new Schema({ });


 db.on('error',  (err)=>{ throw err }); 

 db.once('open', function callback() {
    console.log('connected!');
    /* car.save((err,data)=>{
        if(err){ console.log(err); db.close();}
        else{console.log(`saved ${data.name}`); db.close();}
    }); */

    // model.find({},(err,data)=>{
    //     if( err){ console.log(err)}
    //     else{ console.log(data) }
    // });
    
});