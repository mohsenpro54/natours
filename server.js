/*eslint-disable*/
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT RJECTION :boom: shutting down ...');
  console.log(err.name, err.message);
  process.exit(1);
  //     server.close(()=> {

  //     });
});

dotenv.config({ path: './config.env' });
const app = require('./app');
//require("dotenv").config();
//console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//process.env.DATABASE_LOCAL, {
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successfull!'));

// const tourSchema = new mongoose.Schema({
//     name:{
//         type : String,
//         required:[true, 'a tour must have a name'],
//         unique:true
//     },
//     rating:{
//         type:Number,
//         default:4.5
//     },
//     price:{
//         type: Number,
//         required:[true, 'a tour must have a price']
//     }
// });
// const Tour = mongoose.model('Tour',tourSchema);

// const testTour = new Tour({
//     name:'The Forest Hiker 1 ',
//     rating:4.7,
//     price:497
// });
// const testTour = new Tour({
//     name:'The Park Camper ',
//     price : 997
// });
// testTour
// .save()
// .then(doc => {
//     console.log(doc);
// })
// .catch( err => {
//     console.log('error :boom:', err);
// });
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app runnig on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED RJECTION :boom: shutting down ...');
  server.close(() => {
    process.exit(1);
  });
});
// process.on('uncaughtException',err => {
//     console.log(err.name, err.message);
//     console.log('UNCAUGHT RJECTION :boom: shutting down ...');
//     server.close(()=> {

//         process.exit(1);
//     });
// });
// console.log(x);
