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

    specialization: {
        type: String
        // default: ''
    },

    pastJobs: [pastJobSchema],
    achievements: [achievmentSchema]

    // author: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // },
}, {
    timestamps: true
});

var Adverts = mongoose.model('Advert', advertSchema);

module.exports = Adverts;

// {
//     "description" : "Esu 2 treneris",
//         "workExperience" : "2019-2020",
//             "achievements" : "dafiga",
//                 "specialization" : "kachalka",
//                     "jobExperiences" : [

//                     ]
// }
//PAST JOBS
                        // {
                        //     "startDate": "2020-01-01",
                        //     "endDate": "2222222",
                        //     "jobDescription": "Solid darbas"
                        // }
//ACHIEVEMENTS
