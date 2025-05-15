const Favorite = require('../models/favorite.model');
const User = require('../models/user.model');

// Add a country to favorites
exports.addFavorite = async (req, res) => {
    try {
        const { countryCode, countryName, countryFlag } = req.body;

        if (!countryCode || !countryName || !countryFlag) {
            return res.status(400).json({
                success: false,
                message: 'Please provide country code, name, and flag'
            });
        }

        // Check if already favorited
        const existingFavorite = await Favorite.findOne({
            user: req.user.id,
            'country.code': countryCode
        });

        if (existingFavorite) {
            return res.status(400).json({
                success: false,
                message: 'Country already in favorites'
            });
        }

        // Create new favorite
        const favorite = await Favorite.create({
            user: req.user.id,
            country: {
                code: countryCode,
                name: countryName,
                flag: countryFlag
            }
        });

        res.status(201).json({
            success: true,
            data: favorite
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Remove a country from favorites
exports.removeFavorite = async (req, res) => {
    try {
        const { countryCode } = req.params;

        const favorite = await Favorite.findOneAndDelete({
            user: req.user.id,
            'country.code': countryCode
        });

        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: 'Favorite not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Favorite removed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Get user's favorite countries
exports.getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ user: req.user.id })
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({
            success: true,
            count: favorites.length,
            data: favorites
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
