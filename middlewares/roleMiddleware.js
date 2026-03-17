exports.isOwner = async (req, res,next) => {
    if(req.user.role!=="owner"){
        return res.status(403).json("Access denied!")
    }
    next()
}


exports.isCustomer = async (req, res, next) => {
      if(req.user.role!=="customer"){
        return res.status(403).json("Access denied!")
    }
    next()
}