import mongoose
    from "mongoose";
const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    albumId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    // If using local storage, filename under backend/uploads/ (e.g. "abcd123.mp3"). Optional when using Cloudinary.
    audioFile: {
        type: String,
        required: false
    },
    // If using Cloudinary, store the secure URL here
    audioUrl: {
        type: String,
        required: false
    },
    // total play count
    playCount: {
        type: Number,
        default: 0
    },
    releaseDate: {
        type: Date,
        required: true
    },
    genre: {
        type: String,
        required: true
    }
},{timestamps: true});

const Song = mongoose.model("Song", songSchema);
export default Song;
