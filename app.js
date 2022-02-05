/*eslint-disable*/
//const fs= require('fs');
const express = require('express');
const path = require('path');
//const { json } = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const reviewRouter = require('./routes/reviewRoutes.js');
const bookingRouter = require('./routes/bookingRoutes.js');
const bookingController = require('./controllers/bookingController.js');

const viewRouter = require('./routes/viewRoutes.js');

// Start express app
const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));
///// 1) GLOBAL MIDDLEWARE
//// impliment cors
app.use(cors());

app.options('*', cors());
//// serving static files
app.use(express.static(path.join(__dirname, 'public')));
//// set security http headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//app.options('/api/v1/tours/:id', cors());
// app.use(helmet());
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

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());

app.use(xss());

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
///// prevent parameter pollution
app.use(compression());
///// testing middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
//// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can not find ${req.originalUrl} on this server !`, 404));
});
////////////////// 4) start the server
app.use(globalErrorHandler);

module.exports = app;
