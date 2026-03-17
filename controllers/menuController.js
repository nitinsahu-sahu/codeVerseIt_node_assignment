const Menu = require("../models/Menu");
const redis = require("../config/radis");

exports.addMenuItem = async (req, res) => {
     try {
        const { name,price,category} = req.body;
       if(!name||!price||!category){
          res.status(400).json({
            message: "All field required!",
            success:false
        });
       }
       const item = await Menu.create({
        name,price,category,owner:req.user.id
       })
       await req.redis?.flushhall?.();

        res.status(201).json({
          message: "Add menu successfully",
          data:item,
          success:true
        });
      } catch (error) {
        res.status(500).json({
          success:false,
          message: "Error adding user",
          error: error.message,
        });
      }
}

exports.updateMenuItem = async (req, res) => {
     try {
        const { itemId} = req.params;
        const updates = req.body;
        const item = await Menu.findById(itemId)
        if(!item){
          return res.status(404).json({msg:"Item not found"})
        }
        if(item.owner.toString()!==req.user.id){
          return res.status(403).json({msg:"Not authorized!"})
        }
        Object.assign(item,updates)
        await item.save()
        await req.redis?.flushhall?.();

        res.status(201).json({
          message: "Menu update successfully",
          data:item,
          success:true
        });
      } catch (error) {
        res.status(500).json({
          success:false,
          message: "Error adding user",
          error: error.message,
        });
      }
}

exports.getMenu = async (req, res) => {
     try {
        const { category,page = 1,limit=10} = req.query;
        const cacheKey = `menu : ${category}:${page}`
        const cached = await redis.get(cacheKey)
        if(cached) return res.json(JSON.parse(cached))
        const query = category?{category}:{};
        const data = await Menu.find(query).skip((page - 1)*limit).limit(Number(limit))
        res.status(201).json({
          message: "Fetch menu successfully",
          data,
          success:true
        });
      } catch (error) {
        res.status(500).json({
          success:false,
          message: "Error adding user",
          error: error.message,
        });
      }
}