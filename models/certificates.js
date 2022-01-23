const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const certificateSchema = new Schema({
    certificateName: {
        type: String,
        required: true,
        unique: true
    },
    certificateDescription: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

var Certificates = mongoose.model('Certificate', certificateSchema);

module.exports = Certificates;



// {
//     "certificateName": "Esu 1 sertifikatas",
//     "certificateDescription": "Sertifikato aprašymas",
//     "isApproved": false
// }