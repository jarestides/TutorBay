const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create Schema
const CardSchema = new Schema(
    {
        _id: {
            type: Number
        },
        Subject_id: {
            type: Number,
            required: true
        },
        Title: {
            type: String,
            required: true
        },
        Link: {
            type: String,
            required: true
        },
        Article: {
            type: String,
            required: true
        }
    },
    { collection: 'Lessons'}
);
const lesson = mongoose.model('Lessons', CardSchema);
module.exports = lesson;