const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const advertSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    workExperience: {
        type: String
        //required: true
    },
    achievements: {
        type: String
        // required: true
    },
    specialization: {
        type: String
        // default: ''
    },
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
//     "description" : "Esu kiets treneris",
//     "workExperience" : "2019-2020",
//     "achievements" : "dafiga",
//     "specialization" : "kachalka"
// }