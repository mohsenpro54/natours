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
//const { bodyParser } = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingController = require('./controllers/bookingController');

const viewRouter = require('./routes/viewRoutes');

// Start express app
const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
///// 1) GLOBAL MIDDLEWARE
//// serving static files
//// impliment cors
app.use(cors());
app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));

//// set security http headers
app.use(helmet());
////access-controll-allow-origin*
////api.natours.com,front-end natours.com
// app.use(
//   cors({
//     origin: 'https://www.natours.com',
//   })
// );

// app.options('*', cors());
//app.options('/api/v1/tours/:id', cors());
// app.use(helmet());
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

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout
);
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
app.use(compression());
///// testing middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});
//// 3) ROUTES

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server !`, 404));
});
////////////////// 4) start the server

app.use(globalErrorHandler);

module.exports = app;
