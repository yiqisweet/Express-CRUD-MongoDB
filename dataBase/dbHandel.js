

'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var model = require('./model');

for(let m in model){
    mongoose.model(m,new Schema(model[m]));
}

function _getModel(type){
    return mongoose.model(type);
}

module.exports = {
    getModel : _getModel
}