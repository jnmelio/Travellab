require("../db");
const mongoose = require("mongoose");
const CountryModel = require("../models/Country.model.js");
const axios = require("axios");

axios
  .get("https://restcountries.eu/rest/v2/all")
  .then((response) => {
    return CountryModel.create(response.data);
  })
  .then(() => {
    console.log("seed done");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
    mongoose.connection.close();
  });
