const mongoose = require('mongoose');
const shortid = require('shortid');
const _ = require('lodash');

var ExerciseSchema = new mongoose.Schema({
    _user: { // Reference to the _id of the user that added this exercise
        type: String,
        required: true,
        ref: 'User'
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
}, {
    toObject: { virtuals: true }
});

ExerciseSchema.virtual('dateString').get(function() {
    return new Date(this.date)
        .toLocaleDateString('en-US', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
        })
        .split(',').join('');
});

ExerciseSchema.methods.toJSON = function () {
    var exercise = this;
    var exerciseObject = exercise.toObject();

    return _.pick(exerciseObject, ['description', 'duration', 'dateString']);
};

var Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = { Exercise };
