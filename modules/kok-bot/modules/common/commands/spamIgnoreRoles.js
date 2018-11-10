"use strict";
const logger = require('../../../../logger');
const reqAccess = require('../reqAccess');
const responseDict = require('../responseDict');
const roles = require('../../roles');
const help = require("./help");
const spamListener = require("../../anti-spam");

module.exports = new SpamIgnoreRoles();

function SpamIgnoreRoles() {

    this.exec = (msg, commandArguments) => {
        let argsArray = [];
        if (commandArguments.length !== 0) {
            argsArray = commandArguments.split(" ");
        }
        if (argsArray.length > 0) {
            let command = argsArray[0].toLowerCase();

            if (this[command]) {
                this[command](msg, argsArray)
            } else {
                msg.channel.send("Unknown command");
            }
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }

    this.add = (msg, argsArray) => {
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    let spamIgnoreRoleID = argsArray[1];
                    let thisGuild = msg.guild;
                    return roles.spamIgnore.add(spamIgnoreRoleID, thisGuild);
                })
                .then(() => {
                    spamListener.listener.updateSpamIgnore('add', msg.guild.id, 'spamIgnoreRoles', argsArray[1]);
                    msg.channel.send(responseDict.success())
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail());
                })
        } else if (argsArray.length > 2) {
            msg.channel.send(responseDict.tooManyParams());
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }

    this.remove = (msg, argsArray) => {
        if (argsArray.length === 2) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    let spamIgnoreRoleID = argsArray[1];
                    let thisGuild = msg.guild;
                    return roles.spamIgnore.remove(spamIgnoreRoleID, thisGuild);
                })
                .then(() => {
                    spamListener.listener.updateSpamIgnore('remove', msg.guild.id, 'spamIgnoreRoles', argsArray[1]);
                    msg.channel.send(responseDict.success())
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail());
                })
        } else if (argsArray.length > 2) {
            msg.channel.send(responseDict.tooManyParams());
        } else {
            msg.channel.send(responseDict.noParams());
        }
    }

    this.list = (msg, argsArray) => {
        if (argsArray.length === 1) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => roles.spamIgnore.list(msg.guild.id))
                .then(res => {
                    if (res) {
                        msg.channel.send(res)
                            .catch(err => logger.log(err));
                    } else {
                        msg.channel.send(responseDict.fail())
                            .catch(err => logger.log(err));
                    }
                })
                .catch(err => {
                    logger.log(err);
                    msg.channel.send(responseDict.fail())
                        .catch(err => logger.log(err));
                })
        } else {
            msg.channel.send(responseDict.tooManyParams());
        }
    }
}

let helpMessage = "Adds,Removes the specified role to be ignored by the spam detector or lists the ignored roles";
let template = "spamignoreroles <add|remove|list> <role Id>";
let example = [
    "`-spamignoreroles add 1234567890`",
    "`-spamignoreroles remove 1234567890`",
    "`-spamignoreroles list`"];

help.AddHelp("spamignoreroles", helpMessage, template, example);