const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {

     (mongoose.connect("mongodb://127.0.0.1:27017/doc")).then(
   (data)=>{
    console.log(`connected to mongo successfully`)
   }
     ).catch(
        (err)=>{
            console.log(err)
        }
     )
 }
module.exports = connectDB;