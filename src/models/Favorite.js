import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    animeId: {
      type: Number,
      required: [true, 'Anime ID is required']
    },
    animeTitle: {
      type: String,
      required: [true, 'Anime title is required']
    },
    animeImage: {
      type: String,
    }
  },
  {
    timestamps: true
  }
);

// Prevent user from favoriting the same anime multiple times
favoriteSchema.index({ user: 1, animeId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
