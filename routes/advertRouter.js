const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const Adverts = require('../models/adverts');

const advertRouter = express.Router();

advertRouter.use(bodyParser.json());

advertRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Adverts.find(req.query)
            .populate('comments.author')
            .then((adverts) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(adverts);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Adverts.create(req.body)
            .then((advert) => {
                console.log('Advert Created ', advert);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(advert);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /adverts');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Adverts.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

advertRouter.route('/:advertId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get((req, res, next) => {
        Adverts.findById(req.params.advertId)
            //.populate('comments.author')
            .then((advert) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(advert);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /adverts/' + req.params.advertId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Adverts.findByIdAndUpdate(req.params.advertId, {
            $set: req.body
        }, { new: true })
            .then((advert) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(advert);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Adverts.findByIdAndRemove(req.params.advertId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = advertRouter;