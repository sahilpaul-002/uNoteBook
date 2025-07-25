import mongoose from 'mongoose';
const { Schema } = mongoose;

const notes = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: String,
    default: "Default"
  },
  pending: {
    type: Boolean,
    default: true
  },
  inProgress: {
    type: Boolean,
    default: false
  },
  complete: {
    type: Boolean,
    default: false
  },
  timeStamp: {
    type: Date,
    default: Date.now
  }
});

const Note = mongoose.model("Note", notes)
export { Note };