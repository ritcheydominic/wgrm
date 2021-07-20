const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    permissions: {
        type: Map,
        of: Boolean,
        default: {}
    },
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;