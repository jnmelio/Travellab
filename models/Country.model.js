const { Schema, model } = require("mongoose");

const countrySchema = new Schema({
  name: String,
  numericCode: Number,
  callingCodes: [String],
  capital: String,
  region: String,
  subregion: String,
  population: Number,
  latlng: [Number],
  demonym: String,
  timezones: [String],
  borders: [String],
  nativeName: String,
  currencies: [
    {
      name: String,
      symbol: String,
    },
  ],
  languages: [
    {
      name: String,
      nativeName: String,
    },
  ],
  flag: String,
});

const countryModel = model("country", countrySchema);

module.exports = countryModel;
