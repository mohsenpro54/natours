/*eslint-disable*/
const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT RJECTION! shutting down ...');
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

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app runnig on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED RJECTION! shutting down ...');
  server.close(() => {
    process.exit(1);
  });
});
process.on('SIGTERM', () => {
  console.log('SIGTERM RECEIVED, shutting down gracefully');
  server.close(() => {
    console.log(' process terminated');
  });
});
