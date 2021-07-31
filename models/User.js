const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    groups: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    permissions: {
        type: [String],
        default: []
    },
    active: {
        type: Boolean,
        default: true
    },
    version: {
        type: Number,
        default: 1
    },
    versionKey: false
});

const User = mongoose.model('User', userSchema);

module.exports = User;