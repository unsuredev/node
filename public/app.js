const path = require("path");
const express = require("express"); //to import express
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); //to access and handle mongoDb
const cors =require('cors');
const app = express();


const postsRoutes = require("../routes/posts");

/*********************   atlas connection link***************** */
mongoose
  .connect(
    "mongodb+srv://cukzz:cukzz1234@cluster0-0q6tp.mongodb.net/cukzzblogs", { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/static', express.static(path.join(__dirname, 'public')))

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept,User-Agent,Referer"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//   );
//   next();
// });
app.use(cors());
app.use("/api/posts", postsRoutes);
module.exports = app;
