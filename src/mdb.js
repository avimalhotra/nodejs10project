const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

    // Connection URL
const url = 'mongodb://localhost:27017';

    // Enter Database Name
const dbName = 'node';

    // Create a new MongoClient
const client = new MongoClient(url,{ useUnifiedTopology: true });


const insertDocuments = function(db, callback) {
     // Get the documents collection
 const collection = db.collection('cars');

     // Insert some documents
 collection.insertMany([
     {name:"xl6",brand:"Maruti Suzuki",type:"muv",price:1150000,fuel:"petrol"},
     {name:"ignis",brand:"Maruti Suzuki",type:"hatchback",price:750000,fuel:"petrol"},
 ], function(err, result) {
      //console.log(result);
     assert.equal(err, null);
     assert.equal(2, result.insertedCount);
     //assert.equal(2, result.ops.length);
     console.log("Inserted 2 documents in collection");
     callback(result);
});
};
const findDocuments = function(db, callback) {
   
     // Get the documents collection
     const collection = db.collection('cars');
    
      // Find some documents
     collection.find({brand:"Maruti Suzuki"}).toArray((err, docs)=>{
         assert.equal(err, null);
         console.log("Found the following records");
         console.log(docs)
         callback(docs);
     });
 }


// Use connect method to connect to the Server
client.connect((err)=>{
  assert.equal(null, err);
  console.log("Connected successfully to db server");

  const db = client.db(dbName);
  
//   insertDocuments(db, function() {
//      client.close();
//    });
     findDocuments(db, ()=>{client.close();});
});