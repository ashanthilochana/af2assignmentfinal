const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    country: {
        code: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        flag: {
            type: String,
            required: true
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to prevent duplicate favorites for the same user and country
favoriteSchema.index({ user: 1, 'country.code': 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
