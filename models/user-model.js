import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email : {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
    default: ""
  },
  isAdmin : {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const UserModel = mongoose.model("users", userSchema);

export default UserModel;
