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
  age : Date, 
  profilePic: String, 
  favoriteCountry: String, 
  favoriteWayOfTraveling: {
    type: String,
    enum:['', 'Plane', 'Boat', 'Road', 'Bike', 'Other']
  },
  typeOfTraveller:{
    type: String,
    enum:['', 'Holidaymaker', 'Business Traveller', 'Backpacker & Adventure Traveller', 'Expedition Member', 'Long Term Traveller', 'Traveller with Special Needs', 'Other']
  },
  countryWishList: [{
    type: Schema.Types.ObjectId,
    ref:'country'
  }],
  countryVisitor: [{
    type: Schema.Types.ObjectId,
    ref:'country'
  }],
});

const User = model("User", userSchema);

module.exports = User;
