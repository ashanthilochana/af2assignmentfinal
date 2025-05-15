const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favorites.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // Protect all routes in this router

router.route('/')
    .get(getFavorites)
    .post(addFavorite);

router.delete('/:countryCode', removeFavorite);

module.exports = router;
