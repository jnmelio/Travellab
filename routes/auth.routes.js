const router = require('express').Router();
const bcrypt = require('bcryptjs');

const UserModel = require('../models/User.model')
let userInfo={}

router.get('/home', (req, res)=>{
  res.render('index.hbs')
})

router.post('/home', (req,res, next)=>{
  const {email, password} = req.body
  if (email === '' || password === '') {
    res.render('index.hbs', {
      msg: 'Please enter both, email and password to login.'
    });
    return;
  }
 UserModel.findOne({email})
    .then((response)=>{
        if(!response){
          res.render('index.hbs', {msg: 'Cannot find your mail'})
        }
      else{
        bcrypt.compare(password, response.password)
            .then((isMatching)=>{
              if(isMatching){
              req.session.userInfo = response
              req.app.locals.isUserLoggedIn = true
              res.redirect("/home/profile")
            }
            else{
              res.redirect('index.hbs', {msg: 'Passwords not matching'})
            }
            })
    }
  }).catch((err)=>{
      next(err)
    })
})


//middleware
const authorize = (req, res, next)=>{
  if(req.session.userInfo){
      next()
  }
  else{
      res.redirect('/home')
  }
}

router.get('/home/profile', authorize, (req,res, next)=>{
  res.render('profile.hbs')
})


router.get('/logout', (req, res, next)=>{
  req.app.locals.isUserLoggedIn = false
  req.session.destroy()
  res.redirect('/')
})


module.exports = router;