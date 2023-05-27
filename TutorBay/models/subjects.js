const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create Schema
const CardSchema = new Schema(
    {
        _id: {
            type: Number
        },
        Name: {
            type: String,
            required: true
        },
        Users_id: {
            type: Number,
            required: true
        }
    },
    { collection: 'Subjects'}
);
const subject = mongoose.model('Subjects', CardSchema);
module.exports = subject;