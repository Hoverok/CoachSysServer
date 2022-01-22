var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    email: {
        type: String,
        default: ''
    },
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    phoneNum: {
        type: String,
        default: ''
    },
    facebook: {
        type: String,
        default: ''
    },
    instagram: {
        type: String,
        default: ''
    },
    lingedin: {
        type: String,
        default: ''
    },
    trainer: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    facebookId: String,
},{
        timestamps: true
    });

//automatically enables storing of username and password(also hashes password)
User.plugin(passportLocalMongoose);


//gets imported by authenticate.js
module.exports = mongoose.model('User', User);

