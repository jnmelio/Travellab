const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const axios = require("axios");

let userInfo = {};


//Get route for the sign up form
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

//Post route for the signup form
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

  const passwordTest = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  if(!passwordTest.test(password)){
    res.render('auth/signup.hbs', {msg: 'Password must be at least 8 characters, must have a number, a special character and an uppercase Letter. Please create your password accordingly'})
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
    .then(() => {
      res.redirect("/signup/firstwishlist");
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/signup/firstwishlist', (req, res, next)=>{
  axios.get(`https://restcountries.eu/rest/v2/all`)
  .then((response)=>{
    res.render('profilePages/firstwish.hbs', {name: response.data})
  })
  .catch((err)=>{
    next(err)
  })
})

router.post('/signup/firstwishlist', (req, res, next)=>{
  const {id} = req.params
  const {country} = req.body
  console.log(req.params)
  User.findById(id)
  .then(()=>{
    res.redirect('/home/profile')
  })
  .catch(()=>{
    console.log('nope')
  })
})


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

//middleware
const authorize = (req, res, next) => {
  if (req.session.userInfo) {
    next();
  } else {
    res.redirect("/home");
  }
<<<<<<< HEAD
};

router.get("/home/profile", authorize, (req, res, next) => {
  res.render("profilePages/profile.hbs");
});
=======
  else{
      res.redirect('/home')
  }
}

router.get('/home/profile', authorize, (req,res, next)=>{
  console.log(req.session.userInfo._id)
res.render('profilePages/profile.hbs', {user: req.session.userInfo})
})

router.get('/profile/:id/edit', (req, res, next)=>{
  const {_id} = req.session.userInfo
  console.log(_id)
  User.findById(_id)
  .then((data) => {
    res.render('profilePages/profile-details.hbs',{data})
  }).catch((err) => {
    console.log(err)
  });
})



>>>>>>> f8a1cac4909e989d06ec8269e366da527703e526

router.get("/logout", (req, res, next) => {
  req.app.locals.isUserLoggedIn = false;
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
