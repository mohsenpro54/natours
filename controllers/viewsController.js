/*eslint-disable*/
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  /// 1) get tour data from collection
  const tours = await Tour.find();
  //// 2) building template

  //// 3) render that template using tour data from 1

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  ///// 1) get the data , for requested tour ( including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('there is not tour in that name', 404));
  }
  ///// 2) build template

  //// 3) render template using the data 1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'log into your account',
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'your account',
  });
};
exports.getMyTours = catchAsync(async (req, res, next) => {
  /// 1) find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  /// 2) find tours with the return ids
  const tourIDs = bookings.map((e) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runvalidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'your account',
    user: updatedUser,
  });
});
