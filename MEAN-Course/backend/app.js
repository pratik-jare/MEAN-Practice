const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const baseconfig = require('./baseConf');

const app = express();

mongoose.connect('mongodb+srv://Pratik_jare:' +
  baseconfig.mongoPassword + '@cluster0-1guyh.mongodb.net/Mean-Stack-Example', { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/", express.static(path.join(__dirname, "meanStackPractice")));

// if angular + node in one folder then no need to use below syntax
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

// till here 

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "meanStackPractice", "index.html"));
});

module.exports = app;


// mongo compass connection command
// mongo "mongodb+srv://cluster0-1guyh.mongodb.net/Mean-Stack-Example" --username Pratik_jare

// change db using command in that -> use <dbname>
//  help 
