const mongoose = require('mongoose');
const shortid = require('shortid');

var ExerciseSchema = new mongoose.Schema({
    _user: { // Reference to the _id of the user that added this exercise
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: { // "Tue Jun 26 2018"
        type: Date,
        default: Date.now,
        validate: {
            validator: function (v) {
                return (!isNaN(new Date(v).getTime()))
            },
            message: '{ VALUE } Invalid date!'
        }
    }
});

ExerciseSchema.virtual('dateString').get(function() {
    return new Date(this.date)
        .toLocaleDateString('en-US', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
        })
        .split(',').join('');
});

var Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = { Exercise };
