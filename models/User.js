const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    groups: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    active: {
        type: Boolean,
        default: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;