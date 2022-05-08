const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const Car=new Schema({
    _id:mongoose.ObjectId,
    name:{ type:String, required:true, unique:true, dropDups:true },
    brand:{ type: String, required: true },
    type:{ type: String, required: true },
    price:{ type: Number, required: true },
    power:{ type: Number, required: true },
    torque:{ type: Number, required: true },
    weight:{ type: Number, required: true },
    fuel:{ type: String, required: true }
},{collection:"cars"});

let carModel=mongoose.model("carModel",Car);
module.exports=carModel;