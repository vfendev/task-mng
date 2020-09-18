const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    listname: {
        type: String,
        trim: true,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Lists = mongoose.model('Lists', listSchema)
module.exports = Lists