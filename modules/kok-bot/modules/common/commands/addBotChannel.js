"use strict";
const reqAccess = require("../reqAccess");
const responseDict = require('../responseDict');
const channels = require('../../channels');
const help = require("./help");

module.exports = new AddBotChannel();

function AddBotChannel() {

    this.exec = (msg, commandArguments) => {
        let argsArray = [];
        if (commandArguments.length !== 0) {
            argsArray = commandArguments.split(" ");
        }
        if (argsArray.length === 1) {
            reqAccess(msg.guild, msg.member, 3)
                .then(() => {
                    channels.addBotChannel(msg, argsArray[0]);
                })
                .catch(err => {
                    console.log(err);
                    msg.channel.sendMessage(responseDict.fail());
                })
        } else if (argsArray.length > 1) {
            msg.channel.sendMessage(responseDict.tooManyParams());
        } else {
            msg.channel.sendMessage(responseDict.noParams());
        }
    }
}

let helpMessage = "addbotchannel <channel Id> - Adds the specified channel as the bot channel";

help.AddHelp("addbotchannel", helpMessage);