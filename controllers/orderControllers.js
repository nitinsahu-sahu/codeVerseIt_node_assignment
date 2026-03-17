const Order = require("../models/Order");
const Menu = require("../models/Menu");

exports.createOrder = async (req, res) => {
    try{
        const { items } = req.body;

        let total = 0;
        let restaurantId;

        for (let i of items) {
            const menuItem = await Menu.findById(i.item);

            total += menuItem.price * i.quantity;
            restaurantId = menuItem.owner;
        }

        const order = await Order.create({
            customer: req.user.id,
            restaurant: restaurantId,
            items,
            totalPrice: total
        });

  // 🔥 socket emit
        //  req.io.to(restaurantId.toString()).emit("newOrder", order);

        res.json({order,success: true});
    }catch (err) {
        res.status(500).json({ msg: err.message, success: false });
    }
  
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate("items.item", "name price category") // menu details
      .populate("restaurant", "name email") // owner info
      .sort({ createdAt: -1 });

    res.json({
      count: orders.length,
      data: orders
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getResturentOrders = async (req, res) => {
    try{
        const { status,page = 1,limit=10} = req.query;
        const query = {restaurant:req.user.id}
        if(status){
            query.status =status
        }
        const orders = await Order.find(query).populate("customer","name email").populate("items.item","name price").sort({createdAt :-1}).skip((page-1)*limit).limit(Number(limit))

        res.status(200).json({count:orders.length,data:orders,success: true});
    }catch (err) {
        res.status(500).json({ msg: err.message, success: false });
    }
};

exports.orderAccept = async (req, res) => {
    try{
        const {orderId} = req.params
        const order = await Order.findById(orderId);
        if(!order){
            res.status(404).json({ msg: "Order not found", success: false });
        }
        // if(order.owner.toString()!==req.user.id){
        //     res.status(403).json({ msg: "Not Authorized!", success: false });
        // }
        // if(item.owner.toString()!==req.user.id){
        //   return res.status(403).json({msg:"Not authorized!"})
        // }
        if(order.status !== "created"){
            res.status(400).json({ msg: `Order already ${order.status}`, success: false });
        }
        order.status="accepted";
        await order.save()
        res.status(200).json({msg:"Order Acceptd",data:order,success: true});
    }catch (err) {
        res.status(500).json({ msg: err.message, success: false });
    }
};

exports.orderCancel = async (req, res) => {
     try{
        const {orderId} = req.params
        const order = await Order.findById(orderId);
        if(!order){
            res.status(404).json({ msg: "Order not found", success: false });
        }
        // if(order.owner.toString()!==req.user.id){
        //     res.status(403).json({ msg: "Not Authorized!", success: false });
        // }
        if(order.status === "delivered" || order.status === "cancelled"){
            res.status(400).json({ msg: `Order can't cancel ${order.status} order`, success: false });
        }
        order.status="cancelled";
        await order.save()
        res.status(200).json({msg:"Order cancelled",data:order,success: true});
    }catch (err) {
        res.status(500).json({ msg: err.message, success: false });
    }
};