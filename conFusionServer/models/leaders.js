const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: false,
        default: ''
    },
    abbr: {
        type: String,
        required: false,
        default: ''
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    featured: {
        type: Boolean,
        default:false      
    }
}, {
    timestamps: true
});

// This will create a collection 'leaders' in whatever db the connection connects to.
var Leaders = mongoose.model('Leader', leaderSchema);

module.exports = Leaders;