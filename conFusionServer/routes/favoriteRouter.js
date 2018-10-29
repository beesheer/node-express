const express = require('express');
const bodyParser = require('body-parser');
const Favorites = require('../models/favorites');
var authenticate = require('../authenticate');
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(authenticate.verifyUser, (req,res,next) => {
    // Get a list of favorite dishes for a user
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        // Create one if needed
        if (favorite != null) {
            // create a list of favorite dishes for a user
            return Favorites.create({
                user: req.user._id,
                dishes: req.body
            });            
        } else {
            favorite.dishes = favorite.dishes.concat(req.body);
            return favorite.save();
        }
    })
    .then((resp) => {
        Favorites.findOne({user: req.user._id})
        .populate('user')
        .populate('dishes')
        .then((favorites) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        }, (err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    // modify a list of favorite dishes for a user
    Favorites.update({
        user: req.user._id,
        dishes: req.body
    })
    .then((resp) => {
        Favorites.findOne({user: req.user._id})
        .populate('user')
        .populate('dishes')
        .then((favorites) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        }, (err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    // delete a list of favorite dishes for a user
    Favorites.findOneAndDelete({
        user: req.user._id
    })
    .then((resp) => {
        res.statusCode = 200;
        res.end('Deleted the favorite.');
    }, (err) => next(err))
    .catch((err) => next(err));
})

favoriteRouter.route('/:dishId')
.get(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Not allowed');
})
.post(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if (favorite != null) {
            favorite.dishes.push({"_id": req.params.dishId});
            favorite.save()
            .then((resp) => {
                Favorites.findOne({user: req.user._id})
                .populate('user')
                .populate('dishes')
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }, (err) => next(err));
            }, (err) => next(err));
        } else {
            Favorites.create({
                user: req.user._id,
                dishes: [{"_id": req.params.dishId}]
            })
            .then((resp) => {
                Favorites.findOne({user: req.user._id})
                .populate('user')
                .populate('dishes')
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }, (err) => next(err));
            }, (err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Not allowed');
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .populate('dishes')
    .then((favorite) => {
        if (favorite != null) {
            //console.log('favorite', favorite.dishes);
            favorite.dishes = favorite.dishes.filter((dish) => {
                return dish._id != req.params.dishId
            })
            favorite.save()
            .then((resp) => {
                Favorites.findOne({user: req.user._id})
                .populate('user')
                .populate('dishes')
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }, (err) => next(err));
            }, (err) => next(err));
        } else {
            res.statusCode = 400;
            res.end('Bad request');
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;