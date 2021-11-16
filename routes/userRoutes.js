/*eslint-disable*/
const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

// const allUsers = (req,res)=> {
//     res.status(500).json({
//         status: 'error',
//         message: 'this route is not yet defined'
//     });
// };
// const User = (req,res)=> {
//     res.status(500).json({
//         status: 'error',
//         message: 'this route is not yet defined'
//     });
// };
// const createUser = (req,res)=> {
//     res.status(500).json({
//         status: 'error',
//         message: 'this route is not yet defined'
//     });
// };

// const updateUser = (req,res)=> {
//     res.status(500).json({
//         status: 'error',
//         message: 'this route is not yet defined'
//     });
// };
// const deleteUser = (req,res)=> {
//     res.status(500).json({
//         status: 'error',
//         message: 'this route is not yet defined'
//     });
// };

//const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//// protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
