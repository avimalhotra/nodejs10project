const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const Admin=new Schema({
    _id:mongoose.ObjectId,
    name:{ type:String, required:true, unique:true, dropDups:true },
    pass:{ type: String, required: true }
},{collection:"admin"});

let adminModel=mongoose.model("adminModel",Admin);
module.exports=adminModel;