import mongoose from 'mongoose';
const { Schema } = mongoose;

const users = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  timeStamp: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", users)

export { User };