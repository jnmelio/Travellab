const router = require("express").Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model')
const axios = require('axios')


//Get route for the sign up form 
router.get('/signup', (req, res, next)=>{
  res.render('auth/signup.hbs')
})

//Post route for the signup form
router.post('/signup', (req, res, next)=>{
  const {username, password, email, age, photo, favoriteCountry, favoriteWayOfTraveling} = req.body

  // Only those 3 are required at registration, the others are optionnal
  if (!username || !email || !password ) {
    res.render('auth/signup.hbs', {msg: 'Please enter all fields marked by a *'})
    return;
  }
  const emailTest = /^\S+@\S+\.\S+$/
  if(!emailTest.test(email)) {
    res.render('auth/signup.hbs', {msg: 'Please enter a valid email format'})
    return;
  }

const passwordTest = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
if(!passwordTest.test(password)){
  res.render('auth/signup.hbs', {msg: 'Password must be at least 8 characters, must have a number, a special character and an uppercase Letter. Please create your password accordingly'})
  return;
}

const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync(password, salt);

User.create({username, password:hash, email, age, photo, favoriteCountry, favoriteWayOfTraveling})
  .then((data)=>{
    res.render('profilePages/firstwish.hbs', {data})
  })
  .catch((err)=>{
    next(err)
  })
})


module.exports = router