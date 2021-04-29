// variables and require
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const axios = require("axios");
const countryModel = require("../models/Country.model");
const uploader = require("../middleware/cloudinary");
require("dotenv/config");

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
    .populate("countryWishList", "name latlng")
    .populate("countryVisitor", "name latlng")
    .then((data) => {
      res.render("profilePages/profile.hbs", {
        user: data,
        country: JSON.stringify(data),
      });
    })
    .catch((err) => {
      next(err);
    });
});

//DELETE COUNTRY IN LISTS
router.post("/home/profile/:countryId", (req, res, next) => {
  const { countryId } = req.params;
  countryModel
    .findByIdAndDelete(countryId)
    .then((data) => {
      res.redirect("/home/profile");
    })
    .catch((err) => {
      next(err);
    });
});

//ADD A DESTINATION ROUTE
router.get("/country", (req, res, next) => {
  countryModel
    .find()
    .then((response) => {
      res.render("country/addADestination.hbs", {
        country: JSON.stringify(response),
        user: req.session.userInfo,
      });
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
      let clientId = process.env.CLIENT_ID;
      let { name } = data;
      let url =
        "https://api.unsplash.com/search/photos?client_id=" +
        clientId +
        "&query=" +
        name;

      //make a request to the api

      axios
        .get(url)
        .then(function (response) {
          if (response.data.total == 0) {
            res.render("country/country-details.hbs", {
              msg: "Please enter a valid country name",
            });
          } else {
            res.render("country/country-details.hbs", {
              images: response.data.results,
              data,
              user: req.session.userInfo,
            });
          }
        })
        .catch((err) => next(err));
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/country/:countryId/:list", (req, res, next) => {
  const { _id } = req.session.userInfo;
  const { countryId, list } = req.params;
  User.findByIdAndUpdate(_id, { $push: { [list]: countryId } }, { new: true })
    .then(() => {
      res.redirect("/home/profile");
    })
    .catch((err) => {
      next(err);
    });
});

// ACCOUNT DETAILS ROUTE
router.get("/profile/details", (req, res, next) => {
  const { _id } = req.session.userInfo;
  User.findById(_id)
    .then((data) => {
      res.render("profilePages/profile-details.hbs", { user: data });
    })
    .catch((err) => {
      next(err);
    });
});

//EDIT ACCOUNT INFOS ROUTES
router.get("/profile/edit", (req, res, next) => {
  const { _id } = req.session.userInfo;
  User.findById(_id)
    .then((data) => {
      res.render("profilePages/profile-edit", { user: data });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/profile/edit", (req, res, next) => {
  const { _id } = req.session.userInfo;
  const {
    username,
    age,
    favoriteCountry,
    favoriteWayOfTraveling,
    typeOfTraveller,
  } = req.body;
  User.findByIdAndUpdate(_id,
    {
      username,
      age,
      favoriteCountry,
      favoriteWayOfTraveling,
      typeOfTraveller,
    },
    { new: true }
  )
    .then((data) => {
      req.session.userInfo = data;
      res.redirect("/profile/details");
    })
    .catch((err) => {
      next(err);
    });
});

//PROFILE PIC
router.post(
  "/upload",
  authorize,
  uploader.single("image"),
  (req, res, next) => {
    User.findByIdAndUpdate(
      req.session.userInfo._id,
      {
        profilePic: req.file.path,
      },
      { new: true }
    )
      .then((data) => {
        req.session.userInfo = data;
        res.redirect("/profile/edit");
      })
      .catch((err) => {
        next(err);
      });
  }
);

//DELETE THE ACCOUNT
router.post("/profile/delete", (req, res, next) => {
  const { _id } = req.session.userInfo;
  User.findByIdAndDelete(_id)
    .then(() => {
      req.app.locals.isUserLoggedIn = false;
      req.session.destroy();
      res.redirect("/home");
    })
    .catch((err) => {
      next(err);
    });
});

//EXPORTS
module.exports = router;
