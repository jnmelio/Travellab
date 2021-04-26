const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,   
    unique: true, 
  },
  password: {
    type:String,
    required:true,
  },
  email : {
    type: String, 
    required: true
  },
  age : Number, 
  photo: String, 
  favoriteCountry: String, 
  favoriteWayOfTraveling: {
    type: String,
    enum:['', 'Plane', 'Boat', 'Road', 'Bike', 'Other']
  },
  typeOfTraveller:{
    type: String,
    enum:['', 'Holidaymaker', 'Business Traveller', 'Backpacker & Adventure Traveller', 'Expedition Member', 'Long Term Traveller', 'Traveller with Special Needs', 'Other']
  },
  country: [String],
});

const User = model("User", userSchema);

module.exports = User;
