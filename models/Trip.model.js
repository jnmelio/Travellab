const { Schema, model } = require("mongoose");

const tripSchema = new Schema({
  tripName: String,
  mainCitytoVisit: String,
  activitiesToDo: {
    type: String,
    enum: ["", "Shopping", "Sport Activities", "Sightseeing", "Culinary Experiences", "Cultural experiences","Other"],
  }, 
  notes: String,
  /*userId: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],*/
})

const tripModel = model("trip", tripSchema);

module.exports = tripModel;