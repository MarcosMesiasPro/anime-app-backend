import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // ID numérico de AniList (ej: 21)
    animeId: {
      type: Number,
      required: true,
    },
    animeTitle: {
      type: String,
      required: true,
      trim: true,
    },
    animeCover: {
      type: String,
      default: '',
    },
    animeGenres: {
      type: [String],
      default: [],
    },
    animeFormat: {
      type: String,
      default: '',
    },
    animeStatus: {
      type: String,
      default: '',
    },
    animeEpisodes: {
      type: Number,
      default: null,
    },
    animeScore: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

// Un usuario no puede tener el mismo anime dos veces en favoritos
favoriteSchema.index({ user: 1, animeId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
