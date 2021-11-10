var express = require('express');
var router = express.Router();

var User = require('../models/user');

// GET REQUESTS //
router.get('/', (req, res, next) => {
    res.json({ 'funny': 'I remember not liking to see JSON. Now I love it!' });
});

router.get('/users', (req, res, next) => {
    User.find({}, (err, result) => {
        if (err) { return next(err); }
        res.json(result);
    });
});

router.get('/user/:address', (req, res, next) => {
    User.findOne({address: req.params.address}, (err, result) => {
        if (err) { return next(err); }
        res.json(result);
    })
});


// POST REQUESTS //
router.post('/user/create', (req, res, next) => {
    User.findOne({ address: req.body.address }, (err, result) => {
        if (err) { return next(err); }
        if (result) { console.log('A record with this address already exists.'); }
        else {
            var user = new User({
                address: req.body.address,
                email: req.body.email,
                phone: req.body.phone,
                shippingAddress: req.body.shippingAddress,
            });
            user.save((err, result) => {
                if (err) { return next(err); }
                res.status(201).json(result);
            });
        }
    });
});


// PUT REQUESTS //
router.put('/user/:address/update', (req, res, next) => {
    User.findOneAndUpdate({ address: req.params.address }, { email: req.body.email, phone: req.body.phone, shippingAddress: req.body.shippingAddress }, { upsert: true, new: true }, (err, result) => { 
        if (err) { next(err); }
        res.status(200).json(result);
    });
});

module.exports = router;