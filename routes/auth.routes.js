// variables and require
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const axios = require("axios");
let userInfo = {};
function randomCountry(response) {
  let randomName = []
  for (let i = 0; i < 10; i++) {
    randomName.push(response[Math.floor(Math.random() * response.length)])
  }
  console.log(randomName)
  return randomName
}

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
    photo,
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
    photo,
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
  axios
    .get(`https://restcountries.eu/rest/v2/all`)
    .then((response) => {
      let random = randomCountry(response.data)
      res.render("profilePages/firstwish.hbs", { name: random });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/signup/firstwishlist", (req, res, next) => {
  const { id } = req.session.userInfo;
  const {countryId} = req.body
  User.findByIdAndUpdate(id, {countryId})
    .then((data) => {
      res.redirect('/home/profile')
    })
    .catch(() => {
      console.log("nope");
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

//MIDDLEWARE
const authorize = (req, res, next) => {
  if (req.session.userInfo) {
    next();
  } else {
    res.redirect("/home");
  }
};

//PROFILE ROUTES
router.get("/home/profile", authorize, (req, res, next) => {
  console.log(req.session.userInfo._id);
  res.render("profilePages/profile.hbs", { user: req.session.userInfo });
});

// ACCOUNT DETAILS ROUTE
router.get("/profile/:id/details", (req, res, next) => {
  const { _id } = req.session.userInfo;
  console.log(_id);
  User.findById(_id)
  .then((data) => {
    res.render('profilePages/profile-details.hbs',{data})
  }).catch((err) => {
    console.log(err)
  });
})

//COUNTRY DETAILS ROUTES
router.get('/country', (req, res, next)=>{
  axios
  .get(`https://restcountries.eu/rest/v2/all`)
  .then((response) => {
    res.render("country/country-details.hbs", { country: response.data });
  })
  .catch((err) => {
    next(err);
  });
})


//EDIT ACCOUNT INFOS ROUTES
router.get("/profile/:id/edit", (req, res, next) => {
  const { _id } = req.session.userInfo;
  
  console.log(_id);
  User.findById(_id)
    .then((data) => {
      res.render("profilePages/profile-edit", { data });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post('/profile/:id/edit', (req, res,next)=>{
  const {_id} = req.session.userInfo
  const {username, age, favoriteCountry, favoriteWayOfTraveling, typeOfTraveller} = req.body
  User.findByIdAndUpdate(_id, {username, age, favoriteCountry, favoriteWayOfTraveling, typeOfTraveller})
    .then((data) => {
      res.redirect("/profile/:id/details")
    }).catch((err) => {
      console.log(err)
    });
})

//Delete your account route
router.post('/profile/:id/delete', (req, res, next)=>{
  const {_id} = req.session.userInfo
  User.findByIdAndDelete(_id)
  .then(() => {
    req.app.locals.isUserLoggedIn = false;
    req.session.destroy();
    res.redirect('/home')
  }).catch((err) => {
    console.log(err)
  });
})


//LOG OUT ROUTE
router.get("/logout", (req, res, next) => {
  req.app.locals.isUserLoggedIn = false;
  req.session.destroy();
  res.redirect("/");
});

//EXPORTS
module.exports = router;
