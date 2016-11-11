"use strict";
module.exports = new Promise((resolve, reject) => {
    require('../db')
    .then(mongoose=>{
        let Schema = mongoose.Schema;
        let passportLocalMongoose = require('passport-local-mongoose');

        let User = new Schema({
            level: {
                type: Number,
                required: true
            },
            gameRole: {
                type: String,
                required: true,
                enum: require('../public/modules/services/game-roles-service')
            },
            platform: {
                type: String,
                required: true,
                enum: require('../public/modules/services/platforms-service')
            },
            continent: {
                type: String,
                required: true,
                enum: require('../public/modules/services/continents-service')
            },
            reasonToJoin: {
                type: String,
                required: false,
                maxlength: 1000
            },
        });

        User.plugin(passportLocalMongoose);
        resolve(mongoose.model('User', User));
    })
    .catch(err=>console.dir(err));
})


