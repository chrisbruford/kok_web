"use strict";
const util = require('util');
const eventEmitter = require('events').EventEmitter;
const logger = require('../modules/logger/logger');

function WingController() {

    eventEmitter.call(this);

    this.joinWing = (searchParams, wingName) => {
        return new Promise((resolve, reject) => {
            require('../models/user')
                .then(user => {
                    user.findOneAndUpdate(
                        searchParams,
                        {
                            $addToSet: { wings: { name: wingName } }
                        })
                        .then((user) => {
                            if (user) {
                                this.emit('joinWing', { user, wingName });
                                return resolve(user);
                            } else {
                                return reject(new Error("No such user"));
                            }
                        })
                        .catch(err => {
                            logger.log(err);
                            reject(err);
                        })
                })
                .catch(err => {
                    logger.log(err);
                    reject(err);
                })
        })
    }

    this.leaveWing = (searchParams, wingName) => {
        return new Promise((resolve, reject) => {
            require('../models/user')
                .then(userModel => {
                    userModel.findOneAndUpdate(searchParams, { $pull: { wings: { name: wingName } } })
                        .then(user => {
                            if (!user) {
                                return reject(false);
                            }
                            //see if wing was in original set anyway
                            let exists = user.wings.filter(wing => {
                                return wing.name === wingName;
                            })

                            if (exists.length > 0) {
                                this.emit('leaveWing', { user, wingName });
                                return resolve(true);
                            } else {
                                reject(false);
                            }
                        })
                        .catch(err => {
                            logger.log(err);
                            reject(err);
                        })
                })
                .catch(err => {
                    logger.log(err);
                    reject(err);
                })
        })
    }

    this.listMembers = (wingName) => {
        return new Promise((resolve, reject) => {
            require('../models/user')
                .then(userModel => {
                    userModel.find({ "wings.name": { $eq: wingName } }, { username: 1 })
                        .then(users => {
                            logger.log(users);
                            resolve(users);
                        })
                        .catch(err => {
                            logger.log(err);
                            reject(err);
                        })
                })
                .catch(err => {
                    logger.log(err);
                    reject(err);
                })
        })
    }
}

util.inherits(WingController, eventEmitter);

module.exports = new WingController();