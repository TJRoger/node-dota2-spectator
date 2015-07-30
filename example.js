//
//  dota2.js
//  dota2 spectator
//
//  Created by Roger (betterservant@gmail.com) on 07/28/15.
//  Copyright (c) 2015 betterservant.com. All rights reserved.
//
//  Description: 
var fs = require('fs');
var path = require('path');
var util = require('util');
var crypto = require('crypto');
var steam = require('steam');
var dota = require('./');
//var Long = require('long'); // you might need this to work with SteamIDs since they are 64-bit
var bot = new steam.SteamClient();
var user = new steam.SteamUser(bot);
var friends = new steam.SteamFriends(bot);
var trading = new steam.SteamTrading(bot);
var dota2GC = new steam.SteamGameCoordinator(bot, 570);
var dota2 = new dota.Dota2Client(bot, user, dota2GC, 570);

global.config = require('./config');

var debug = true;
function debuglog(foo,foodes){
        if(foodes){
                    util.log(foodes+': ');
                        }
            if (debug == true && typeof foo == 'object') {
                        util.log(util.inspect(foo, false, null));
                            }else {
                                        util.log(foo);
                                            }
}

// if we've saved a server list, use it
if (fs.existsSync('servers')) {
	  steam.servers = JSON.parse(fs.readFileSync('servers'));
}

var logOnDetails = {
	'account_name': config.steam_user,
	'password': config.steam_pass
};

if (fs.existsSync('sentryfile/'+logOnDetails.account_name)){ 
	var file = fs.readFileSync('sentryfile/' + logOnDetails.account_name);
    logOnDetails.sha_sentryfile = crypto.createHash('sha1').update(file).digest();
    util.log('sentry loaded');
}
else if(config.steam_guard_code !=''){
	logOnDetails.auth_code = config.steam_guard_code;
}

bot.connect();
util.log('Bot is trying to connect to steam network...');
/* Steam logic */
var onSteamConnected = function onSteamConnected(){
	util.log('Connected to steam network.');
	user.logOn(logOnDetails);
	util.log('Bot is trying to login...');
}

function deepLog(object, filename){
    util.log(util.inspect(object, false, null));
    writeFile(filename, JSON.stringify(object));
}

function writeFile(filepath, file){
    var fileExist = true;
    var filetype = "." + filepath.split('.').pop();
    var filepath = filepath - filetype;
    var fileNumber = 1;
    while(fileExist){
        fileNumber_str = fileNumber.toString(); 
        var current = filename + fileNumber_str + filetype;
        if (fs.existsSync(__dirname + "/tmp/" + current)) {
            fileNumber++;
        } else {
            var newPath = __dirname + "/tmp/" + current;
            fs.writeFile(newPath, file, function (err) {
                util.log('file saved');
            });
            break;
        }
    }

}

var onSteamLogOnResponse = function onSteamLogOnResponse(logOnResponse){
	if(logOnResponse.eresult == steam.EResult.OK) {
		util.log('Bot logged in!');
		friends.setPersonaState(steam.EPersonaState.LookingToPlay);
		//bot.setPersonaName('BOT<Deep Blue>');
        friends.joinChat('103582791434333751');
		// the group's SteamID as a string
		util.log('As '+bot.steamID);
        dota2.launch();
        //dota2.exit();
        util.log(dota2.AccountID);
        //util.log(util.inspect(dota2, false, null));
        //dota2.findSourceTVGames({'leagueid': 2773});
		//dota2GC.
	}else {
		util.log('Error: '+ logOnResponse);
	}
}

var onSteamServers = function onSteamServers(servers){
	fs.writeFile('servers', JSON.stringify(servers));
}

var onSteamError = function onSteamError(error){
    util.log(error);
    console.warn("Disconnected from Steam network. Retrying in 5 seconds ...");
    // Let's attempt to reconnect again in 5 seconds.
    setTimeout(function() {
    bot.connect();
    }, 5000);
}

var onUserUpdateMachineAuth = function onUserUpdateMachineAuth(sentry, callback){
	 fs.writeFileSync('sentryfile/'+config.steam_user, sentry.bytes);
	 util.log("sentryfile saved");
	 callback({ sha_file: crypto.createHash('sha1').update(sentry.bytes).digest() });
}

var onUserTradeOffers =  function onUserTradeOffers(count){
	util.log('You have '+count+'trade offers incoming');
}

var onFriendsChatInvite = function onFriendsChatInvite(chatRoomID, chatRoomName, patronID) {
	util.log('Got an invite to ' + chatRoomName + ' from ' + friends.personaStates[patronID].player_name);
	friends.joinChat(chatRoomID); // autojoin on invite
    console.log(chatRoomID);
}

var onFriendsMessage = function onFriendsMessage(source, message, type, chatter){
	// respond to both chat room and private messages
    if (type == 1) //1, message; 2, tying
        if(friends.personaStates[source] != undefined)
        console.log('Received message: ' +message+' from '+friends.personaStates[source].player_name);
        else
            console.log('Received message: ' +message);
        //console.log(util.inspect(steam.EChatEntryType, false, null));
	if (message == 'ping') {
		friends.sendMessage(source, 'pong', steam.EChatEntryType.ChatMsg); // ChatMsg by default
	}
}

var onFriendsChatStateChange = function onFriendsChatStateChange(stateChange, chatterActedOn, steamIdChat, chatterActedBy) {
	if (stateChange == steam.EChatMemberStateChange.Kicked && chatterActedOn == bot.steamID) {
		friends.joinChat(steamIdChat);  // autorejoin!
	}
}

var onFriendsClanState = function onFriendsClanState(clanState) {
	if (clanState.announcements.length) {
		util.log('Group with SteamID ' + clanState.steamid_clan + ' has posted ' + clanState.announcements[0].headline);
		}
}

var onDota2GCMessage = function onDota2GCMessage(header, body, callback){
	//util.log('Header: '+header+'\nBody: '+body+'\nCallback: '+callback);
    //deepLog(header, 'header');
    //deepLog(body, 'body');
    //deepLog(callback, 'callback');
    util.log('dota2.js received :'+header.msg);
    //debuglog(body, 'body');
}

/*
var onDota2GCMessage = function onDota2GCMessage(res){
    deepLog(res, 'res');
}
*/

var onDota2GCSend = function onDota2GCSend(header, body, callback){
		util.log('sending '+header.msg+'\nBody: '+body);
}

var onDota2Message = function onDota2Message(header, body, callback){
    util.log('Dota2 received message: \nHeader: '+header+'\nbody: '+body);
}

var onDota2ClientWelcome = function onDota2ClientWelcome(){
    util.log('Welcome to play Dota2!');

    setTimeout(dota2.findSourceTVGames({leagueid: 2733}),1000);
    /*
     * dota2.joinChatChannel({
        channel_name: 'Node.js',
        channel_type: Dota2.methods.joinChatChannel.channel_type.DOTAChannelType_Custom // or just 1
    });
    */
}

var onDota2JoinChatChannel = function onDota2JoinChatChannel(res){
    util.log('Joined chat channel: '+res);
}

var onDota2ChatMessage = function onDota2ChatMessage(res){
    util.log('chat message: ');
    var name = res.persona_name;
    var channelID = res.channel_id;
    var msg = res.text.split(' ');
    if (msg[0] == '.whowon' && msg[1]) {
        dota2.matchDetails(
            { match_id: msg[1] }, 
            name, channelID); // you can pass any extra arguments
    }
}
var onDota2MatchDetails = function onDota2MatchDetails(res, name, channelID) {
    util.log('matchDetails: ');
    console.log(res);

    if(!res.match) {
        dota2.chatMessage({
            text: name + ': invalid match ID!',
            channel_id: channelID
        });
        return;
    }

    util.log('got info on '+res.match.match_id);
    dota2.chatMessage({
        text: name + ': ' + (res.match.good_guys_win ? 'Radiant' : 'Dire') + ' won this match',
        channel_id: channelID
    });
}
//https://github.com/seishun/node-steam
bot.on('connected', onSteamConnected)
    .on('logOnResponse', onSteamLogOnResponse)
    .on('servers', onSteamServers)
    //.on('loggedOff', onSteamLoggedOff)
    //.on('message', onSteamMessage)
    //.on('send', onSteamSend)
    .on('error', onSteamError);

//https://github.com/seishun/node-steam/tree/master/lib/handlers/user
user.on('updateMachineAuth', onUserUpdateMachineAuth)
.on('tradeOffers', onUserTradeOffers);

//https://github.com/seishun/node-steam/tree/master/lib/handlers/friends
friends.on('chatInvite', onFriendsChatInvite)
//.on('personaState', onFriendsPersonaState)
.on('message', onFriendsMessage)
.on('chatStateChange', onFriendsChatStateChange)
.on('clanState', onFriendsClanState);

/*
//https://github.com/seishun/node-steam/tree/master/lib/handlers/trading
trading.on('tradeProposed', onTradeProposed)
.on('tradeResult', onTradeResult)
.on('sessionStart', onTradeSessionStart);
*/
//https://github.com/seishun/node-steam/tree/master/lib/handlers/game_coordinator
dota2GC.on('message', onDota2GCMessage)
.on('send', onDota2GCSend);

dota2.on('clientWelcome', onDota2ClientWelcome)
//.on('message', onDota2Message)
//.on('joinChatChannel', onDota2JoinChatChannel)
//.on('chatMessage', onDota2ChatMessage)
//.on('matchDetails', onDota2MatchDetails)
;
