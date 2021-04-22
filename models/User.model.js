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
  favoriteWayOfTraveling: String, 
});

const User = model("User", userSchema);

module.exports = User;
