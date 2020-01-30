const mongoose = require('mongoose');

const GuiSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    deck:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const UserSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        default: Date.now
    },
    restPasswordToken: {
        type: String
    },
    restPasswordExpires: {
        type: Date,
        default: Date.now
    },
    decks: [GuiSchema]
});

const User = mongoose.model('User', UserSchema); //name of the model is 'User'
module.exports = User;

