import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
    ,
    // optional listening history: recent listens (userId optional when not recorded)
    listeningHistory: [
        {
            song: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
            listenedAt: { type: Date, default: Date.now }
        }
    ]
},{timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;
