//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose')
const md5 = require("md5")

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded
    ({ extended: true }));


mongoose.connect("mongodb://localhost:27017/netflixDB", { useNewUrlParser: true });
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("user", userSchema);

app.get("", (req, res) => {
    res.render("index")
})
app.get("/signin", (req, res) => {
    res.render("signin")
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.get("/step", (req, res) => {
    res.render("step")
})
app.post("/step", (req, res) => {
    const newUser = User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save(function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("saved");
            res.render("index");

        }
    })
})
app.post('/signin', (req, res) => {
    const username = req.body.username;
    const password = md5(req.body.password);
    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err)
            // res.render("register")
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    console.log("logged in")
                    res.render("index")
                }
            }
        } if (!foundUser){
            res.redirect('register')
        }
    })
})
app.listen(3000, function () {
    console.log("server has started at port 3000");
});