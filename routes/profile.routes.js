// variables and require
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const axios = require("axios");
const countryModel = require("../models/Country.model");
const uploader = require("../middleware/cloudinary");

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
  User.findById(req.session.userInfo._id)
    .populate("countryWishList", "name")
    .populate("countryVisitor", "name")
    .then((data) => {
      res.render("profilePages/profile.hbs", {
        user: req.session.userInfo,
        country: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//DELETE COUNTRY IN LISTS
router.post("/home/profile/:countryId", (req, res, next) => {
  const { countryId } = req.params;
  console.log(countryId);
  countryModel
    .findByIdAndDelete(countryId)
    .then((data) => {
      res.redirect("/home/profile");
    })
    .catch((err) => {
      console.log(err);
    });
});

//ADD A DESTINATION ROUTE
router.get("/country", (req, res, next) => {
  countryModel
    .find()
    .then((response) => {
      res.render("country/addADestination.hbs", { country: JSON.stringify(response) });
    })
    .catch((err) => {
      next(err);
    });
});

//COUNTRY DETAILS ROUTES
router.get("/country/:id", (req, res, next) => {
  const { id } = req.params;
  countryModel
    .findById(id)
    .then((data) => {
      res.render("country/country-details.hbs", { data });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/country/:countryId/:list", (req, res, next) => {
  const { _id } = req.session.userInfo;
  const { countryId, list } = req.params;
  console.log(countryId, list);
  User.findByIdAndUpdate(_id, { $push: { [list]: countryId } }, { new: true })
    .then(() => {
      res.redirect("/home/profile");
    })
    .catch((err) => {
      console.log(err);
    });
});

// ACCOUNT DETAILS ROUTE
router.get("/profile/:id/details", (req, res, next) => {
  const { _id } = req.session.userInfo;
  console.log(_id);
  User.findById(_id)
    .then((data) => {
      res.render("profilePages/profile-details.hbs", { data });
    })
    .catch((err) => {
      console.log(err);
    });
});

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

router.post("/profile/:id/edit", (req, res, next) => {
  const { _id } = req.session.userInfo;
  const {
    username,
    age,
    favoriteCountry,
    favoriteWayOfTraveling,
    typeOfTraveller,
  } = req.body;
  User.findByIdAndUpdate(_id, {
    username,
    age,
    favoriteCountry,
    favoriteWayOfTraveling,
    typeOfTraveller,
  })
    .then((data) => {
      res.redirect("/profile/:id/details");
    })
    .catch((err) => {
      console.log(err);
    });
});

//PROFILE PIC
router.post(
  "/upload",
  authorize,
  uploader.single("image"),
  (req, res, next) => {
    User.findByIdAndUpdate(req.session.userInfo._id, {
      profilePic: req.file.path,
    })
      .then((data) => {
        res.redirect("/home/profile");
      })
      .catch((err) => {
        console.log(err);
      });
  }
);

//DELETE THE ACCOUNT
router.post("/profile/:id/delete", (req, res, next) => {
  const { _id } = req.session.userInfo;
  User.findByIdAndDelete(_id)
    .then(() => {
      req.app.locals.isUserLoggedIn = false;
      req.session.destroy();
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
});

//EXPORTS
module.exports = router;
