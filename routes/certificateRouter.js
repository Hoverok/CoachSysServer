const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const Certificates = require('../models/certificates');
const Users = require('../models/user');

const certificateRouter = express.Router();

certificateRouter.use(bodyParser.json());

certificateRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Certificates.find(req.query)
            .populate('author')
            .then((certificates) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(certificates);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Certificates.create(req.body)
            .then((certificate) => {
                console.log('Certificate Created ', certificate);
                certificate.author = req.user._id;
                certificate.save()
                    .then((certificate) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(certificate);
                    })
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /certificates');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Certificates.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

certificateRouter.route('/:certificateId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get((req, res, next) => {
        Certificates.findById(req.params.certificateId)
            .populate('author')
            .then((certificate) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(certificate);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /certificates/' + req.params.certificateId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Certificates.findByIdAndUpdate(req.params.certificateId, {
            $set: req.body
        }, { new: true })
            .then((certificate) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(certificate);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Certificates.findByIdAndRemove(req.params.certificateId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = certificateRouter;
