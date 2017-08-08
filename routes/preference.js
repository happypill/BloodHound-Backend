import express from 'express';
import userController from '../controller/user';
import request from 'request';
import User from '../models/User';

const router = express.Router();

/* GET index page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'PREFERENCE'
  });
});

/*POST USER PREFERENCE TO DASHBOARD*/
router.post('/stock/:id', (req, res, next)=> {
   let id = req.params.id;
   console.log(id);

   User.findById({_id: id}, (err, user) => {
    if (err) return res.json({message: 'could not find user because: ' + err})
    const name = req.body.result;

    let preference = {
      name: name,
      volume: 0,
      entryPrice: 0,
      totalPrice: 0
    }
    user.preference.push(preference);
    user.save();

    // res.render('settings', {
    //   acctBalance: user.acctBalance
    // });
  });
});

router.post('/update/:id', (req, res, next)=> {
   let id = req.params.id;
   console.log(id);
   User.findById({_id: id}, (err, user) => {
    if (err) return res.json({message: 'could not find user because: ' + err})
    const symbol = req.body[0].stockSymbol;

    console.log(symbol);
    const entryPrice = req.body[0].entryPrice;
    const volume = req.body[0].stockVolume;
    const totalPrice = req.body[0].stockTotalPrice;

    let updatedPreference = user.preference.filter((item) => {
      const userPreferencesymbol = item.name;
      return symbol == userPreferencesymbol;
    })

    updatedPreference[0].volume = volume;
    updatedPreference[0].entryPrice = entryPrice;
    updatedPreference[0].totalPrice = totalPrice;

    console.log(updatedPreference);
    user.save();
  });

});




export default router;
