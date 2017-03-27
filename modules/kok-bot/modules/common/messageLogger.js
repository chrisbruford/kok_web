"use strict";
let guildUsersModel = require('../../../../models/discord-users.js');
let responseDict = require('./responseDict');

class MessageLogger {

    constructor() {
        this.flushInterval = 3600000 //1hr
        this.flushTimer = null;
        this.guilds = new Map();
    }
    

    logTimestamp(msg) {
        let guildID = msg.guild.id
        //create or retrieve map within the guilds map to store message timestamps
        //then set this user's record to now
        if (!this.guilds.get(guildID)) {this.guilds.set(guildID,new Map())}
        this.messageTimestamps = this.guilds.get(guildID);
        this.messageTimestamps.set(msg.member.id,Date.now());

        if (!this.flushTimer) {
            this.flushTimer = setTimeout(() => {
                
                //custom static method to find document, if none found then creates new one
                //query is returned in either event with a document
                guildUsersModel.findOneOrCreate({guildID},{guildID})
                .then(guildUsers=>{
                    if (guildUsers) {
                        for (let [userID,timestamp] of this.messageTimestamps) {
                            let duplicate = false;

                            //if it finds a duplicate, then updates it and sets duplicate flag
                            //if not the loop ends with flag remaining false
                            guildUsers.users.forEach((user,index,users)=>{
                                if (user.id === userID) {
                                    users[index].lastMessage = timestamp;
                                    duplicate = true;
                                    guildUsers.save();
                                    delete this.flushTimer;
                                    this.messageTimestamps.clear();
                                }
                            })

                            //new record created for this user
                            if (!duplicate) {
                                guildUsers.users.push({id:userID,lastMessage:timestamp});
                                guildUsers.save();
                                delete this.flushTimer;
                                this.messageTimestamps.clear();
                            }
                        }
                    } else {
                        throw new Error("findOneOrCreate() has not returned a model");
                    }
                })
                .catch(err=>{
                    console.log(err);
                })
        }, this.flushInterval);}

    }

}

module.exports = new MessageLogger();