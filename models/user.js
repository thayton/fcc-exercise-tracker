const mongoose = require('mongoose');
const shortid = require('shortid');

var UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        'default': shortid.generate
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        unique: true
    },
    exercises: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise'
    }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return {
        '_id': userObject._id,
        'username': userObject.username,
        'count': userObject.exercises.length,
        'exercises': userObject.exercises
    };
};

var User = mongoose.model('User', UserSchema);

module.exports = { User };
