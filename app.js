/*eslint-disable*/
//const fs= require('fs');
const path = require('path');
const express = require('express');
//const { json } = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

///// 1) GLOBAL MIDDLEWARE
//// serving static files
app.use(express.static(path.join(__dirname, 'public')));

//// set security http headers

app.use(helmet());
//// 1) global middelware

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
///// limit requestes from same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many request from this ip , please try again in an hour!',
});
app.use('/api', limiter);

/////// body parser, reading data from into req.body
//app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//// data sanitization against nosql query injection
app.use(mongoSanitize());

//// data sanitization against xss
app.use(xss());

///// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
//// serving static files
//app.use(express.static(`${__dirname}/public`));

// app.use((req,res,next) => {
//     console.log('hello from the middleware 👋');
//     next();
// });
///// testing middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

////////////////// 2) rout server

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/starter/dev-data/data/tours-simple.json`)
//     );

//     const getalltours=(req,res) => {
//         console.log(req.requestTime);
//         res.status(200).json({
//             status:'success',
//             requestedAt:req.requestTime,
//             result: tours.length,
//             data:{
//                 tours
//             }
//         });
//     };

//     const gettour = (req,res) => {

//         console.log(req.params);

//         const id = req.params.id * 1;
//         const tour = tours.find(el=> el.id === id);
//         //if(id>tours.length)
//         if(!tour){
//             return res.status(404).json({
//                 status:"fail",
//                 message:'invalid id'
//             });
//         }

//         // const tour = tours.find(el=> el.id === id);

//         res.status(200).json({
//             status:'success',

//             data:{
//                 tour
//             }
//         });
//     };

//     const createtour = (req,res)=>{
//         //console.log(req.body);
//         const newId= tours[tours.length-1].id+1;
//         const newTour = Object.assign({id: newId}, req.body);
//         tours.push(newTour);

//         fs.writeFile(`${__dirname}/starter/dev-data/data/tours-simple.json`,JSON.stringify(tours), err=>{

//             res.status(201).json({
//                 status: 'success',
//                 data: {
//                     tours:newTour
//                 }
//             });
//         });
//         //res.send('done');
//     };

//     const updatetour = (req,res)=>{
//         //if(id>tours.length)
//         //if(!tour)
//         if(req.params.id * 1 >tours.length){
//             return res.status(404).json({
//                 status:"fail",
//                 message:'invalid id'
//             });
//         }
//         res.status(200).json({
//             status: 'success',
//             data:{
//                 tour:'<updated tour here...>'
//             }
//         });
//     };

//     const deletetour =  (req,res)=>{
//         //if(id>tours.length)
//         //if(!tour)
//         if(req.params.id * 1 >tours.length){
//             return res.status(404).json({
//                 status:"fail",
//                 message:'invalid id'
//             });
//         }
//         res.status(204).json({
//             status: 'success',
//             data:null
//         });
//     };

//     const allUsers = (req,res)=> {
//         res.status(500).json({
//             status: 'error',
//             message: 'this route is not yet defined'
//         });
//     };
//     const User = (req,res)=> {
//         res.status(500).json({
//             status: 'error',
//             message: 'this route is not yet defined'
//         });
//     };
//     const createUser = (req,res)=> {
//         res.status(500).json({
//             status: 'error',
//             message: 'this route is not yet defined'
//         });
//     };

//     const updateUser = (req,res)=> {
//         res.status(500).json({
//             status: 'error',
//             message: 'this route is not yet defined'
//         });
//     };
//     const deleteUser = (req,res)=> {
//         res.status(500).json({
//             status: 'error',
//             message: 'this route is not yet defined'
//         });
//     };
// // app.get('/api/v1/tours',getalltours);
// // app.get('/api/v1/tours/:id', gettour);
// // app.post('/api/v1/tours',createtour);
// // app.patch('/api/v1/tours/:id', uptadetour);
// // app.delete('/api/v1/tours/:id', deletetour);

// ////////////////////// 3) routs
// // app.use('/api/v1/tours',tourRouter);
// // app.use('/api/v1/users',userRouter);

// const tourRouter = express.Router();
// const userRouter = express.Router();

// tourRouter
// .route('/')
// .get(getalltours)
// .post(createtour);

// tourRouter
// .route('/:id')
// .patch(updatetour)
// .get(gettour)
// .delete(deletetour);

// userRouter
// .route('/')
// .get(allUsers)
// .post(createUser);

// userRouter
// .route('/:id')
// .get(User)
// .patch(updateUser)
// .delete(deleteUser);

//// 3) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //     status:'fail',
  //     message:`can't find ${req.originalUrl} on this server !`
  // });
  // const err= new Error(`can't find ${req.originalUrl} on this server !`);
  // err.status ='fail';
  // err.statusCode = 404;

  next(new AppError(`can't find ${req.originalUrl} on this server !`, 404));
});
////////////////// 4) start the server

// const port = 3000;
// app.listen(port,() => {
//     console.log(`app runnig on port ${port}...`);
// });

app.use(globalErrorHandler);
//     (err,req,res,next)=>{
//     console.log(err.stack);
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'error';

//     res.status(err.statusCode).json({
//        status:err.status,
//        message:err.message
//     });
// });

module.exports = app;
