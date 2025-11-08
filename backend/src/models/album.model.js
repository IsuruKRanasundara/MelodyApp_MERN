import mongoose
    from "mongoose";
    const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
        },
        songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    }],
    artist: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
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

const Album = mongoose.model("Album", albumSchema);
export default Album;
