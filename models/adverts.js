const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pastJobSchema = new Schema({
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String
    },
    jobDescription: {
        type: String,
        required: true
    }
});

const achievmentSchema = new Schema({
    achievementName: {
        type: String,
        required: true
    },
    achevementDescription: {
        type: String
    },
    achievementDate: {
        type: String,
        required: true
    }
});


const advertSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    power: {
        type: Boolean,
    },
    endurance: {
        type: Boolean,
    },
    hiit: {
        type: Boolean,
    },
    crossfit: {
        type: Boolean,
    },
    rehab: {
        type: Boolean,
    },
    weightLoss: {
        type: Boolean,
    },
    weightGain: {
        type: Boolean,
    },
    bodySculpt: {
        type: Boolean,
    },
    pastJobs: [pastJobSchema],

    achievements: [achievmentSchema],

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

var Adverts = mongoose.model('Advert', advertSchema);

module.exports = Adverts;

// {
//     "description": "Esu 2 treneris",
//     "power": true,
//     "endurance": false,
//     "hiit" : true,
//     "crossfit" : false,
//     "rehab" : true,
//     "weightLoss" : false,
//     "weightGain" : true,
//     "bodySculpt" : false,
//     "jobExperiences": [],
//     "achievements": []
// }
//PAST JOBS
// {
//     "startDate": "2020-01-01",
//     "endDate": "2222222",
//     "jobDescription": "Solid darbas"
// }
//ACHIEVEMENTS
// {
//     "achievementName": "Champion of the world",
//     "achevementDescription": "laimėjau pasaulės krepšinio taurę",
//     "achievementDate": "1914"
// }