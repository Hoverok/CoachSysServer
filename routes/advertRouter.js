const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const Adverts = require('../models/adverts');
const Users = require('../models/user');

const advertRouter = express.Router();

advertRouter.use(bodyParser.json());

advertRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Adverts.find(req.query)
            .populate('author')
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
                advert.author = req.user._id;
                advert.save()
                .then((advert) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(advert);
                })
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
            .populate('author')
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

advertRouter.route('/:advertId/pastJobs')
    .get((req, res, next) => {
        Adverts.findById(req.params.advertId)
            .then((advert) => {
                if (advert != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(advert.pastJobs);
                }
                else {
                    err = new Error('Advert ' + req.params.advertId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Adverts.findById(req.params.advertId)
            .then((advert) => {
                if (advert != null) {
                    advert.pastJobs.push(req.body);
                    advert.save()
                        .then((advert) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(advert);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('advert ' + req.params.advertId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /adverts/'
            + req.params.advertId + '/pastJobs');
    })
    .delete((req, res, next) => {
        Adverts.findById(req.params.advertId)
            .then((advert) => {
                if (advert != null) {
                    for (var i = (advert.pastJobs.length - 1); i >= 0; i--) {
                        advert.pastJobs.id(advert.pastJobs[i]._id).remove();
                    }
                    advert.save()
                        .then((advert) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(advert);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Advert ' + req.params.advertId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

advertRouter.route('/:advertId/pastJobs/:pastJobId')
    .get((req, res, next) => {
        Adverts.findById(req.params.advertId)
            .then((advert) => {
                if (advert != null && advert.pastJobs.id(req.params.pastJobId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(advert.pastJobs.id(req.params.pastJobId));
                }
                else if (advert == null) {
                    err = new Error('Advert ' + req.params.advertId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Past job ' + req.params.pastJobId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /adverts/' + req.params.advertId
            + '/pastJobs/' + req.params.pastJobId);
    })
    .put((req, res, next) => {
        Adverts.findById(req.params.advertId)
            .then((advert) => {
                if (advert != null && advert.pastJobs.id(req.params.pastJobId) != null) {
                    if (req.body.startDate) {
                        advert.pastJobs.id(req.params.pastJobId).startDate = req.body.startDate;
                    }
                    if (req.body.endDate) {
                        advert.pastJobs.id(req.params.pastJobId).endDate = req.body.endDate;
                    }
                    if (req.body.jobDescription) {
                        advert.pastJobs.id(req.params.pastJobId).jobDescription = req.body.jobDescription;
                    }
                    advert.save()
                        .then((advert) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(advert);
                        }, (err) => next(err));
                }
                else if (advert == null) {
                    err = new Error('Advert ' + req.params.advertId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Past job ' + req.params.pastJobId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Adverts.findById(req.params.advertId)
            .then((advert) => {
                if (advert != null && advert.pastJobs.id(req.params.pastJobId) != null) {
                    advert.pastJobs.id(req.params.pastJobId).remove();
                    advert.save()
                        .then((advert) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(advert);
                        }, (err) => next(err));
                }
                else if (advert == null) {
                    err = new Error('Advert ' + req.params.advertId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Past job ' + req.params.pastJobId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

advertRouter.route('/:advertId/achievements')
    .get((req, res, next) => {
        Adverts.findById(req.params.advertId)
            .then((advert) => {
                if (advert != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(advert.achievements);
                }
                else {
                    err = new Error('Advert ' + req.params.advertId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        Adverts.findById(req.params.advertId)
            .then((advert) => {
                if (advert != null) {
                    advert.achievements.push(req.body);
                    advert.save()
                        .then((advert) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(advert);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('advert ' + req.params.advertId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /adverts/'
            + req.params.advertId + '/achievements');
    })
    .delete((req, res, next) => {
        Adverts.findById(req.params.advertId)
            .then((advert) => {
                if (advert != null) {
                    for (var i = (advert.achievements.length - 1); i >= 0; i--) {
                        advert.achievements.id(advert.achievements[i]._id).remove();
                    }
                    advert.save()
                        .then((advert) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(advert);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Advert ' + req.params.advertId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

advertRouter.route('/:advertId/achievements/:achievementId')
    .get((req, res, next) => {
        Adverts.findById(req.params.advertId)
            .then((advert) => {
                if (advert != null && advert.achievements.id(req.params.achievementId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(advert.achievements.id(req.params.achievementId));
                }
                else if (advert == null) {
                    err = new Error('Advert ' + req.params.advertId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Achievement ' + req.params.achievementId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /achievements/' + req.params.advertId
            + '/pastJobs/' + req.params.achievementId);
    })
    .put((req, res, next) => {
        Adverts.findById(req.params.advertId)
            .then((advert) => {
                if (advert != null && advert.achievements.id(req.params.achievementId) != null) {
                    if (req.body.achievementName) {
                        advert.achievements.id(req.params.achievementId).achievementName = req.body.achievementName;
                    }
                    if (req.body.achevementDescription) {
                        advert.achievements.id(req.params.achievementId).achevementDescription = req.body.achevementDescription;
                    }
                    if (req.body.achievementDate) {
                        advert.achievements.id(req.params.achievementId).achievementDate = req.body.achievementDate;
                    }
                    advert.save()
                        .then((advert) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(advert);
                        }, (err) => next(err));
                }
                else if (advert == null) {
                    err = new Error('Advert ' + req.params.advertId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Achievement ' + req.params.achievementId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        Adverts.findById(req.params.advertId)
            .then((advert) => {
                if (advert != null && advert.achievements.id(req.params.achievementId) != null) {
                    advert.achievements.id(req.params.achievementId).remove();
                    advert.save()
                        .then((advert) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(advert);
                        }, (err) => next(err));
                }
                else if (advert == null) {
                    err = new Error('Advert ' + req.params.advertId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Achievement ' + req.params.achievementId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = advertRouter;