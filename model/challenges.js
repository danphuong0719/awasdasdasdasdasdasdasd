const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    gitLink: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }

});

// module.exports = mongoose.model('challenges', challengeSchema);
const model = mongoose.model("challenges", ChallengeSchema);

module.exports = model;