const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
  restaurant: {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
  items: [
    {
        item: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Menu"
        },
        quantity:Number
    }
  ],
  totalPrice:Number,
  status:{
    type:String,
    enum:["created","accepted","delivered","cancelled"],   //Created → Accepted → Delivered → Cancelled
    default:"created"
  },
},{timestamps:true});

module.exports = mongoose.model("Order", orderSchema);