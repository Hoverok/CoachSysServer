const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const Adverts = require('../models/adverts');
const Users = require('../models/user');

const myAdvertRouter = express.Router();

myAdvertRouter.use(bodyParser.json());

myAdvertRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyTrainer, (req, res, next) => {
        Adverts.findOne({ author: req.user._id })
            .populate('author')
            .then((advert) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(advert);
                // else {
                //     res.statusCode = 401;
                //     res.end('You are not the author of '
                //         + req.params.advertId + ' advert');
                // }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, (req, res, next) => {
        res.statusCode = 403;
        res.end('post operation not supported on /myAdvert/');
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyTrainer, (req, res, next) => {
        Adverts.findOneAndUpdate({ author: req.user._id }, {
            $set: req.body
        }, { new: true })
            .then((advert) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(advert);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyTrainer, (req, res, next) => {
        Adverts.findOneAndDelete({ author: req.user._id })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
module.exports = myAdvertRouter;