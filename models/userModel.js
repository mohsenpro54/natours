/*eslint-disable*/
const crypto = require('crypto');
//var typeOf = require('typeof');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//const { Console } = require('console');
// name email photo password passwordconfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    rquired: [true, 'plaese tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email !'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'please provid a password!'],
    minlenght: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      ///// only work on create and save !!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords are not the same!',
    },
  },

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
// userSchema.pre('save', async function(next) {
//     /// only run this function if the password was actualy modified
//     if(!this.isModified('password')) return next();
//     /// hashd the password with cost of 12
//     this.password = await bcrypt.hash(this.password, 12);
//     /// delete the passwordconfirm field
//     this.passwordConfirm = undefined;
//     next();
// });
// userSchema.pre('save', function(next) {
//     if(!this.isModified('password') || this.isNew) return next();

//     this.passwordChangedAt = Date.now() - 1000;
//     next();
// });
userSchema.pre(/^find/, function (next) {
  /// this is point of current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  condidatePassword,
  userPassword
) {
  return await bcrypt.compare(condidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    //console.log(this.changedTimestamp, JWTTimestamp);

    return JWTTimestamp < changedTimestamp;
    //console.log(this.changedTimestamp, JWTTimestamp);
  }
  /// false means not changed
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
