const { Schema, model } = require("mongoose");

const countrySchema = new Schema({
  name: String, 
  numericCode: Number,
})

const countryModel = model('country', countrySchema)

module.exports = countryModel;