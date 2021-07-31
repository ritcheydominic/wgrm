const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    permissions: {
        type: [String],
        default: []
    },
    version: {
        type: Number,
        default: 1
    },
    versionKey: false
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;