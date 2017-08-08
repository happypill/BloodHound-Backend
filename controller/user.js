import User from '../models/User';

//RETURN JSON

exports.getAllStocks = (req,res) => {
  //.populate Stock Name
  User.find({}).populate('stockname').exec((err,user) => {
    console.log(user)
    res.json(user);
  })
}

exports.getSpecificStocks= (req, res) => {
    //.Find speicfic stock relating to the user.id
  User.findOne({'_id':req.params.user_id},(err,user) => {
    if(err){console.log(err); return;}
    res.json(stock);
  })
}

exports.postStock = (req,res) => {
  const newUserStock = new User({
    preference:{
      stockname:req.body.stockname,
      entryPrice: req.body.entryPrice
    }
  });

  newUserStock.save((err) => {
    if(err){console.log(err); return;}
    res.json(newUserStock);
  })
}
