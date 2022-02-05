/*eslint-disable*/
const express = require('express');
const viewsController = require('../controllers/viewsController.js');
const authController = require('../controllers/authController.js');
const bookingController = require('../controllers/bookingController.js');

const router = express.Router();
router.use(viewsController.alerts);
router.get('/', authController.isLoggedIn, viewsController.getOverview);

router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get(
  '/my-tours',
  //bookingController.createBookingCheckout,
  authController.protect,
  viewsController.getMyTours
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
