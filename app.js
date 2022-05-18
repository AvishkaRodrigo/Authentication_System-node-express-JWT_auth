const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authroutes');
const cookieParser = require('cookie-parser');
const { requireauth, checkuser } = require('./middleware/authMiddleware');
require ("dotenv").config();

// import authroutes from './routes/authroutes'

const app = express();
const mongoURL = process.env.MONGODB_URL;

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = mongoURL;
mongoose.connect(dbURI)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes

app.get('*', checkuser); // * => for all routes
app.get('/', (req, res) => res.render('home'));
app.get('/specifications', requireauth, (req, res) => res.render('specifications'));
// app.get('/login', (req, res) => res.render('login'));
app.use(authRoutes);








// // cookies

// app.get('/set-cookies', (req, res) => {
//   // res.setHeader('set-cookie', 'newUser=true');  // without cookie-parser

//   res.cookie('newUser', false);
//   res.cookie('IsValid', true, {maxAge: 100*60*60*24, httpOnly:true }) // secure : true => only for https

//   res.send('you got the cookies');

// });

// app.get('/read cookies', (req, res) => {

//   const cookies = res.cookies;
//   console.log(cookies);

//   res.json(cookies);
// });