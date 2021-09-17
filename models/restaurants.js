const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    number:{
        type: String,
        required: true
    },
    creator:{
        type : Schema.Types.ObjectId,
        ref : 'user'
    },
    lastUpdatedOn: Date

        
    
});

module.exports = mongoose.model('restaurant', restaurantSchema);