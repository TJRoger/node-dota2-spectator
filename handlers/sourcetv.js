//
//  sourcetv.js
//  handlers
//
//  Created by Roger (betterservant@gmail.com) on 08/30/15.
//  Copyright (c) 2015 betterservant. All rights reserved.
//
//  Description: 
var Dota = require('../index')
    //merge = require("merge"),
    //fs = require("fs"),
    path = require('path')
    util = require('util'),
    debug = Dota.debug,
    debuglog = Dota.debuglog,
    Dota2 = Dota.Dota2,
//    ProtoBuf = require("protobufjs"),
//    base_gcmessages = ProtoBuf.loadProtoFile(path.join(__dirname, '/../resources/protobufs/dota/base_gcmessages.proto')).build(),
//    gcsdk_gcmessages = ProtoBuf.loadProtoFile(path.join(__dirname, '/../resources/protobufs/dota/gcsdk_gcmessages.proto')).build(),
//    dota_gcmessages_client = ProtoBuf.loadProtoFile(path.join(__dirname, '/../resources/protobufs/dota/dota_gcmessages_client.proto')).build(),
//    protoMask = 0x80000000;

//Methods
Dota.Dota2Client.prototype.findSourceTVGames = function(filterOptions, callback){
    callback = callback || null;
    debuglog('send league search request');
    this._gc.send({
        msg:  Dota2.EDOTAGCMsg.k_EMsgGCFindSourceTVGames,
        proto: {}
    },
    new Dota2.CMsgFindSourceTVGames(filterOptions).toBuffer(),
    callback);
}


Dota.Dota2Client.prototype.spectateFriendGame = function(friend, callback){

    callback = callback || null;
    this._gc.send({
        msg: Dota2.EDOTAGCMsg.k_EMsgGCSpectateFriendGame,
        proto: {}
    },new Dota2.CMsgSpectateFriendGame(friend).toBuffer(),
    callback);
}

//Handlers
var handlers = Dota.Dota2Client.prototype._handlers;

//7032
handlers[Dota2.EDOTAGCMsg.k_EMsgGCSourceTVGamesResponse] = function onSourceTVGamesResponse(message, callback) {
    callback = callback || null;
    var sourceTVGamesResponse = Dota2.CMsgSourceTVGamesResponse.decode(message);
    debuglog(sourceTVGamesResponse, 'sourceTVGamesResponse');
    if (typeof sourceTVGamesResponse.games != 'undefined' && sourceTVGamesResponse.games.length > 0) {
        debuglog('Received SourceTV games data');
        if (callback) callback(sourceTVGamesResponse);
        this.emit('SourceTVGamesResponse', games);
    }else {
        debuglog('Received a bad SourceTV games response');
        if (callback) callback(sourceTVGamesResponse.result, sourceTVgamesResponse);
    }
}

//7074
handlers[Dota2.EDOTAGCMsg.k_EMsgGCSpectateFriendGameResponse] = function onGCSpectateFriendGameResponse(message, callback) {

    var callback = callback || null;
    var response = Dota2.CMsgSpectateFriendGameResponse.decode(message);
    debuglog(response, 'spectate friend game response');
}

//7402
handlers[Dota2.EDOTAGCMsg.k_EMsgDOTALiveLeagueGameUpdate] = function onDOTALiveLeagueGameUpdate(message, callback){
    var response = Dota2.CMsgDOTALiveLeagueGameUpdate.decode(message);
    debuglog(response, 'live league game update response');
    this.emit('DOTALiveLeagueGameUpdate', response.live_league_games);

}

//8010
handlers[Dota2.EDOTAGCMsg.k_EMsgGCToClientFindTopSourceTVGamesResponse] = function onGCToClientFindTopSourceTVGamesResponse(message, callback) {
    callback = callback || null;
    var topSourceTVGamesResponse = Dota2.CMsgGCToClientFindTopSourceTVGamesResponse.decode(message);
    debuglog(topSourceTVGamesResponse, 'topSourceTVGamesResponse');
    if (typeof sourceTVGamesResponse.games != 'undefined' && topSourceTVGamesResponse.games.length > 0) {
        debuglog('Received topSourceTV games data');
        if (callback) callback(topSourceTVGamesResponse);
    }else {
        debuglog('Received a bad SourceTV games response');
        if (callback) callback(topSourceTVGamesResponse.result, topSourceTVGamesResponse);
    }
};
