'use strict';

var mongoose = require('mongoose');

/*
    title: "List Title",
    listID: "iv3v3mtv"
    owner: "m.james.morrison00@gmail.com"
*/

var listSchema = new mongoose.Schema({
    title: String,
    listID: String,
    owner: String,
    collaborators: Array
},
{
	timestamps: true
});

var listModel = mongoose.model('List', listSchema);

module.exports = listModel;
