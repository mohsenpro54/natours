/*eslint-disable*/
//const appError = require('./../utils/appError');
const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/\d{4}-\d{2}(-\d{2})?/)[0];
  //const value = err.errmsg.match(/(["'])(\\?.)*\1/)[0];
  // console.log(value);

  const message = `Duplicate field value :${value} .please use another valus !`;
  return new AppError(message, 400);
};
const handlerValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalide input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError('invalide token, please login again!', 401);

const handleJWTExpiredError = () => new AppError('your token has expired', 401);

const sendErrorDev = (err, req, res) => {
  //// a) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  ///// b) RENDER WEBSITE
  console.error('ERROR', err);
  return res.status(err.statusCode).render('error', {
    title: 'something went wrrong',
    msg: err.message,
  });
};
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      ///// operational, trusted : send message to the client
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      ///// programming or other unknown error : don't leak error details
    }
    // 1) log error
    console.error('ERROR', err);

    /// 2) send generic message
    return res.status(500).json({
      status: 'error',
      message: 'something went very wrong!',
    });
  }
  if (err.isOperational) {
    // console.log(err);
    ///// operational, trusted : send message to the client
    return res.status(err.statusCode).render('error', {
      title: 'something went wrrong',
      msg: err.message,
    });
    ///// programming or other unknown error : don't leak error details
  }
  // 1) log error
  console.error('ERROR', err);

  /// 2) send generic message
  return res.status(err.statusCode).render('error', {
    title: 'something went wrrong',
    msg: 'please try again later',
  });
};

module.exports = (err, req, res, next) => {
  //console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handlerValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
