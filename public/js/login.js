/*eslint-disable*/
// import axios from 'axios';
// const axios = require('axios').default;
// import { showAlert } from './alerts.js';
// ////
// export const login = async (email, password) => {
//   try {
//     const res = await axios({
//       method: 'POST',
//       // url: 'http://127.0.0.1:3000/api/v1/users/login',
//       url: '/api/v1/users/login',
//       data: {
//         email,
//         password,
//       },
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', 'logged in successfuly');
//       window.setTimeout(() => {
//         location.assign('/');
//       }, 1500);
//     }
//     //console.log(res);
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };
// export const logout = async () => {
//   try {
//     const res = await axios({
//       method: 'GET',
//       // url: 'http://127.0.0.1:3000/api/v1/users/logout',
//       url: '/api/v1/users/logout',
//     });
//     if ((res.data.status = 'success')) location.reload(true);
//   } catch (err) {
//     console.log(err.response);
//     showAlert('error', 'error logout try again');
//   }
// };
