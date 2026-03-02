import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    animeId: {
      type: Number,
      required: [true, 'Anime ID is required'],
      index: true
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      maxlength: [500, 'Comment cannot be more than 500 characters']
    },
    likes: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }]
  },
  {
    timestamps: true
  }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
