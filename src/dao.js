const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/node', {useNewUrlParser: true, useUnifiedTopology: true});

const db=mongoose.connection;
db.on('error',  (err)=>{ throw err }); 

db.once('open', function callback() {
   console.log('db connected!');
});