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
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = { User };
