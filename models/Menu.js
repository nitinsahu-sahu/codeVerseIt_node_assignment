const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
  
},{timestamps:true});

menuSchema.index({category:1});

module.exports = mongoose.model("Menu", menuSchema);