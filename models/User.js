import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true},
  email: { type: String, unique: true},
  password: String,
  preference:[{
       name: String,
       volume: {type: Number, default: 0},
       entryPrice: {type: Number, default: 0},
       totalPrice: {type: Number, default: 0}
     }]
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
  const user = this;
  console.log(user);
  /* Skip salting and hashing if not user signup */
  if (!user.isModified('password')) { return next(); }
  /* Salting and hashing on initial save */
  bcrypt.genSalt(10, (err, salt) => {
    console.log("salting..");
    // console.log(salt);
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      console.log("hashing..");
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};


const User = mongoose.model('User', userSchema);


module.exports = User;
