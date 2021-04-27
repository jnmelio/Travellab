// variables and require
const router = require("express").Router();
const bcrypt = require("bcryptjs");
require("dotenv/config");
const User = require("../models/User.model");
const axios = require("axios");
const countryModel = require("../models/Country.model");
let userInfo = {};
let newCountry = []
function randomCountry(response) {
  let randomName = []
  for (let i = 0; i < 10; i++) {
    randomName.push(response[Math.floor(Math.random() * response.length)])
  }
  return randomName
}


//YANIS ROAD
router.get('/search', (req,res,next)=>{
    let clientId = process.env.CLIENT_ID
    let {query} = req.query; 
    let url = "https://api.unsplash.com/search/photos?client_id="+clientId+"&query="+query 

    //make a request to the api
    if(!query){
      res.render('country/image-search.hbs')
    }
    else{
      axios
      .get(url)
      .then(function(data){
        if(data.data.total==0){
          res.render('country/image-search.hbs', {msg: "Please enter a valid country name"})
        }
        else{
          res.render('country/image-search.hbs', {images: data.data.results})
        }
      })
      .catch((err)=>console.log(err))
    }
})

//SIGN UP ROUTES
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", (req, res, next) => {
  const {
    username,
    password,
    email,
    age,
    profilePic,
    favoriteCountry,
    favoriteWayOfTraveling,
    country,
  } = req.body;

  // Only those 3 are required at registration, the others are optionnal
  if (!username || !email || !password) {
    res.render("auth/signup.hbs", {
      msg: "Please enter all fields marked by a *",
    });
    return;
  }
  const emailTest = /^\S+@\S+\.\S+$/;
  if (!emailTest.test(email)) {
    res.render("auth/signup.hbs", { msg: "Please enter a valid email format" });
    return;
  }

  const passwordTest = /^(?=.*\d)(?=.*[a-z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,}$/;
  if (!passwordTest.test(password)) {
    res.render("auth/signup.hbs", {
      msg:
        "Password must be at least 8 characters, must have a number, a special character and an uppercase Letter. Please create your password accordingly",
    });
    return;
  }

  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(password, salt);

  User.create({
    username,
    password: hash,
    email,
    age,
    profilePic,
    favoriteCountry,
    favoriteWayOfTraveling,
    country,
  })
    .then((response) => {
      req.session.userInfo = response
      req.app.locals.isUserLoggedIn = true;
      res.redirect("/signup/firstwishlist");
    })
    .catch((err) => {
      next(err);
    });
});

//FIRST WISHILIST ROUTES
router.get("/signup/firstwishlist", (req, res, next) => {
  countryModel.find()
    .then((response) => {
      let random = randomCountry(response)
      res.render("profilePages/firstwish.hbs", { name: random });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/signup/firstwishlist", (req, res, next) => {
  const { _id } = req.session.userInfo;
  const {countryWishList} = req.body
  User.findByIdAndUpdate(_id, {countryWishList}, {new: true})
    .then((response) => {
      res.redirect('/home/profile')
    })
    .catch((err) => {
      console.log(err);
    });
});

//HOME ROUTES
router.get("/home", (req, res) => {
  res.render("index.hbs");
});

router.post("/home", (req, res, next) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.render("index.hbs", {
      msg: "Please enter both, email and password to login.",
    });
    return;
  }
  User.findOne({ email })
    .then((response) => {
      if (!response) {
        res.render("index.hbs", { msg: "Cannot find your mail" });
      } else {
        bcrypt.compare(password, response.password).then((isMatching) => {
          if (isMatching) {
            req.session.userInfo = response;
            req.app.locals.isUserLoggedIn = true;
            res.redirect("/home/profile");
          } else {
            res.render("index.hbs", { msg: "Password incorrect" });
          }
        });
      }
    })
    .catch((err) => {
      next(err);
    });
});


//LOG OUT ROUTE
router.get("/logout", (req, res, next) => {
  req.app.locals.isUserLoggedIn = false;
  req.session.destroy();
  res.redirect("/");
});


//EXPORTS
module.exports = router;
