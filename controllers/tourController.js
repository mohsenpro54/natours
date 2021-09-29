/*eslint-disable*/
const multer = require('multer');
const sharp = require('sharp');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! please upload only images', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);
//// upload.single image  req.file
//// upload.array images  req.files
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  //console.log(req.files);
  if (!req.files.imageCover || !req.files.images) return next();

  /// 1) cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  /// images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
      req.body.images.push(filename);
    })
  );
  next();
});

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  next();
};
// class APIFeatures {
//     constructor(query, queryString) {
//         this.query = query;
//         this.queryString= queryString;
//     }
//     filter() {
//         const queryObj = {...this.queryString};
//         const excludedFields = ['page', 'sort', 'limit', 'fields'];
//         excludedFields.forEach(el => delete queryObj[el]);
//         //1.b) advenced filtring
//         let queryStr = JSON.stringify(queryObj);

//         //let queryStr = JSON.stringify(queryObj);

//         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`);

//         this.query.find(JSON.parse(queryStr));
//         return this;
//     }
//     sort() {
//         if(this.queryString.sort){
//             const sortBy = this.queryString.sort.split('.').join(' ');
//             //console.log(sortBy);
//             this.query = this.query.sort(sortBy);
//             //sort('price ratingsAvarage');
//         }else{
//             this.query = this.query.sort('-createdAt');
//         }
//         return this;
//     }
//     limitFields() {
//         if(this.queryString.fields){
//             const fields = this.queryString.fields.split('.').join(' ');
//             this.query = this.query.select(fields);
//         }else{
//             this.query = this.query.select('-__v');
//         }
//         return this;
//     }
//     paginate() {
//         const page = this.queryString.page * 1 || 1 ;
//          const limit= this.queryString.limit * 1 || 100;
//          const skip = (page - 1) * limit;

//          /////page=2&limit=10 , 1-10 page1 , 11-20 page2
//          this.query = this.query.skip(skip).limit(limit);
//         //  if(this.queryString.page){
//         //      const numTours = await Tour.countDocuments();
//         //      if(skip >= numTours) throw new Error('this page does not exist');
//         //  }
//          return this;
//     }
// }
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`)
//     );

// exports.checkID = (req, res, next, val)=> {

//     console.log(`tour id is :${val}`);

//     if(req.params.id * 1 >tours.length){
//         return res.status(404).json({
//             status:"fail",
//             message:'invalid id'
//         });
//     }
//     next();
// };

// exports.checkBody = (req, res, next)=> {
//     if(!req.body.name || !req.body.price){
//        return res.status(400).json({
//            status : 'fail',
//            message: 'missing name or price!'
//        });
//     }
//     next();
// };

exports.getAllTours = factory.getAll(Tour);
// try {
//    console.log(req.query);
//console.log(req.requestTime);
///////BUILD QUERY
// const queryObj = {...req.query};
// const excludedFilds = ['page', 'sort', 'limit', 'fields'];
// excludedFilds.forEach(el => delete queryObj[el]);
// //1.b) advenced filtring
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`);
//console.log(JSON.parse(queryStr));
//1.a)advence filter
//console.log(req.query, queryObj);
// const tours = await Tour.find(queryObj);
//let query = Tour.find(JSON.parse(queryStr));
///2) sorting
//  if(req.query.sort){
//      const sortBy = req.query.sort.split('.').join(' ');
//      //console.log(sortBy);
//      query = query.sort(sortBy);
//      //sort('price ratingsAvarage');
//  }else{
//      query = query.sort('-createdAt');
//  }
///// field limiting

//  if(req.query.fields){
//      const fields = req.query.fields.split('.').join(' ');
//      query = query.select(fields);
//  }else{
//      query = query.select('-__v');
//  }
///// pagination
//  const page = req.query.page * 1 || 1 ;
//  const limit= req.query.limit * 1 || 100;
//  const skip = (page - 1) * limit;

//  /////page=2&limit=10 , 1-10 page1 , 11-20 page2
//  query = query.skip(skip).limit(limit);
//  if(req.query.page){
//      const numTours = await Tour.countDocuments();
//      if(skip >= numTours) throw new Error('this page does not exist');
//  }

//{difficulty:'easy', duration:{$gte:5}};
//{difficulty:'easy', duration:{gte:5}};
//gte gt lte lt
///////////////////////
//({
//     difficulty:'easy',
//     duration:5
// });
// const tours = await Tour.find()
// .where('duration')
// .equals(5)
// .where('difficulty')
// .equals('easy');
//////EXCUTE QUERY

// }catch (err) {
//     res.status(404).json({
//         status : 'fail',
//         message : err
//     });

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

// }catch(err) {
//     status(404).json({
//         status : 'fail',
//         message : err
//     });

//console.log(req.params);

//const id = req.params.id * 1;
// const tour = tours.find(el=> el.id === id);
//if(id>tours.length)
// if(!tour){
//     return res.status(404).json({
//         status:"fail",
//         message:'invalid id'
//     });
// }

// const tour = tours.find(el=> el.id === id);

// res.status(200).json({
//     status:'success',

//     data:{
//         tour
//     }
// });
//});
// // const catchAsync = fn => {
// //     return(req, res, next) => {
// //         //fn(req,res,next).catch(err => next(err));
// //         fn(req,res,next).catch(next);
// //     };
//     // fn(req,res,next).catch(err => next(err))
// };
exports.createTour = factory.createOne(Tour);
//     try {

// }catch (err) {
//     res.status(400).json({
//         status:'fail',
//         message:err
//     };

exports.updateTour = factory.updateOne(Tour);

//  } catch(err) {
//         status(404).json({
//             status : 'fail',
//             message : err
//         });
//     }

//if(id>tours.length)
//if(!tour)
// if(req.params.id * 1 >tours.length){
//     return res.status(404).json({
//         status:"fail",
//         message:'invalid id'
//     });
// }
// res.status(200).json({
//     status: 'success',
//     data:{
//         tour:'<updated tour here...>'
//     }
// });

exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync( async (req,res,next ) => {
//     //try{
//         const tour = await Tour.findByIdAndDelete(req.params.id);
//         if(!tour) {
//             return next(new AppError('NO tour found in that ID', 404));
//            }
//         res.status(204).json({
//             status: 'success',
//             data:null
//         });

// }
//if(id>tours.length)
//if(!tour)
// if(req.params.id * 1 >tours.length){
//     return res.status(404).json({
//         status:"fail",
//         message:'invalid id'
//     });
// }
//    catch(err){
//     status(404).json({
//         status : 'fail',
//         message : err
//     });
//    }
//});
exports.getTourStats = catchAsync(async (req, res, next) => {
  //try{
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //     $match:{_id:{$ne:'EASY'}}
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  // }catch(err) {
  //     status(404).json({
  //         status : 'fail',
  //         message : err
  //     });
  // }
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  //try{
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
  // }catch(err) {
  //     status(404).json({
  //         status : 'fail',
  //         message : err
  //     });
  // }
});

// router.route(
//     '/tours-within/:distance/center/:latlng/unit/:unit',
//      tourController.getToursWithin
//      );
// /tours-within?distance=233&center=-40.45&unit=mi
// /tours-within/34.047475,-118.440617/center/-40.45/unit/mi

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;

  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'please provide latitutr and longitude in the format lat, lng!',
        400
      )
    );
  }
  //console.log(distance, lat, lng, unit );
  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });

  res.status(200).json({
    stats: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});
exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'please provide latitutr and longitude in the format latlng!',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    stats: 'success',
    data: {
      data: distances,
    },
  });
});
