/*eslint-disable*/
// const fs = require('fs');
const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

/// POST(/tour/1234bh1/reviews)
/// GET(/tour/1234bh1/reviews)
/// POST(/tour/1234bh1/reviews/1234hg4)

// router
// .route('/:tourId/reviews')
// .post(authController.protect,
//  authController.restrictTo('user'),
//  reviewController.createReview);

//router.use('/tourId/reviews', reviewRouter);

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`)
//     );

// const getalltours=(req,res) => {
//     console.log(req.requestTime);
//     res.status(200).json({
//         status:'success',
//         requestedAt:req.requestTime,
//         result: tours.length,
//         data:{
//             tours
//         }
//     });
// };

// const gettour = (req,res) => {

//     console.log(req.params);

//     const id = req.params.id * 1;
//     const tour = tours.find(el=> el.id === id);
//     //if(id>tours.length)
//     if(!tour){
//         return res.status(404).json({
//             status:"fail",
//             message:'invalid id'
//         });
//     }

//     // const tour = tours.find(el=> el.id === id);

//     res.status(200).json({
//         status:'success',

//         data:{
//             tour
//         }
//     });
// };

// const createtour = (req,res)=>{
//     //console.log(req.body);
//     const newId= tours[tours.length-1].id+1;
//     const newTour = Object.assign({id: newId}, req.body);
//     tours.push(newTour);

//     fs.writeFile(`${__dirname}/starter/dev-data/data/tours-simple.json`,JSON.stringify(tours), err=>{

//         res.status(201).json({
//             status: 'success',
//             data: {
//                 tours:newTour
//             }
//         });
//     });
//     //res.send('done');
// };

// const updatetour = (req,res)=>{
//     //if(id>tours.length)
//     //if(!tour)
//     if(req.params.id * 1 >tours.length){
//         return res.status(404).json({
//             status:"fail",
//             message:'invalid id'
//         });
//     }
//     res.status(200).json({
//         status: 'success',
//         data:{
//             tour:'<updated tour here...>'
//         }
//     });
// };

// const deletetour =  (req,res)=>{
//     //if(id>tours.length)
//     //if(!tour)
//     if(req.params.id * 1 >tours.length){
//         return res.status(404).json({
//             status:"fail",
//             message:'invalid id'
//         });
//     }
//     res.status(204).json({
//         status: 'success',
//         data:null
//     });
// };

//router.param('id',tourController.checkID);

//create a checkbody middleware
//check if body contain the name and price property
//if not , send back 400 ( bad request)
//add it to the post handler stack

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
//tours-within?distance=233&center=-40.45&unit=mi
//tours-within/233/center/-40.45/unit/mi
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );
//.post(tourController.checkBody,tourController.createtour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )

  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

/// POST(/tour/1234bh1/reviews)
/// GET(/tour/1234bh1/reviews)
/// POST(/tour/1234bh1/reviews/1234hg4)

// router
// .route('/:tourId/reviews')
// .post(authController.protect,
//  authController.restrictTo('user'),
//  reviewController.createReview);

module.exports = router;
