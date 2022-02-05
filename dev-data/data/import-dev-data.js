/*eslint-disable*/
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('./../../models/tourModel.js');
const Review = require('./../../models/reviewModel.js');
const User = require('./../../models/userModel.js');

dotenv.config({ path: './config.env' });
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
//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// import data into to db
const importData = async () => {
  try {
    await Tour.create(tours, { validateBeforeSave: false });
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews, { validateBeforeSave: false });
    console.log('data sucessfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('data sucessfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// console.log(process.argv);
