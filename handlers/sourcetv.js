//
//  sourcetv.js
//  handlers
//
//  Created by Roger (betterservant@gmail.com) on 08/30/15.
//  Copyright (c) 2015 betterservant. All rights reserved.
//
//  Description: 
var Dota = require('../index'),
    util = require('util'),
    debuglog = Dota.debuglog,
    Dota2 = Dota.Dota2;

//Methods

/** message CMsgFindSourceTVGames {
 *      optional string search_key = 1;
 *      optional uint32 start = 2;
 *      optional uint32 num_games = 3;
 *      optional uint32 leagueid = 4;
 *      optional uint32 heroid = 5;
 *      optional bool team_game = 6;
 *      optional uint64 custom_game_id = 10;
 *  }
 */
Dota.Dota2Client.prototype.findSourceTVGames = function(filterOptions, callback){
    callback = callback || null;
    util.log('send league search request');
    if(!this._gcReady){
        debuglog('GC not ready, please listen for the \'ready\' event.');
        return null;
    }
    this._gc.send({
        msg:  Dota2.EDOTAGCMsg.k_EMsgGCFindSourceTVGames,
        proto: {}
    },
    new Dota2.CMsgFindSourceTVGames(filterOptions).toBuffer(),
    callback);
};

/** message CMsgSpectateFriendGame {
 *      optional fixed64 steam_id = 1;
 *  }
 */
Dota.Dota2Client.prototype.spectateFriendGame = function(friend, callback){

    callback = callback || null;
    if(!this._gcReady){
        debuglog('GC not ready, please listen for the \'ready\' event.');
        return null;
    }
    this._gc.send({
        msg: Dota2.EDOTAGCMsg.k_EMsgGCSpectateFriendGame,
        proto: {}
    },new Dota2.CMsgSpectateFriendGame(friend).toBuffer(),
    callback);
};

//Handlers
var handlers = Dota.Dota2Client.prototype._handlers;

//7032
/** message CMsgSourceTVGamesResponse {
 *  repeated .CSourceTVGame games = 1;
 *  optional uint32 num_total_games = 2;
 * }
 */
handlers[Dota2.EDOTAGCMsg.k_EMsgGCSourceTVGamesResponse] = function onSourceTVGamesResponse(message, callback) {
    callback = callback || null;
    var sourceTVGamesResponse = Dota2.CMsgSourceTVGamesResponse.decode(message);
    debuglog(sourceTVGamesResponse, 'sourceTVGamesResponse');
    if (typeof sourceTVGamesResponse.games !== 'undefined' && sourceTVGamesResponse.games.length > 0) {
        util.log('Received SourceTV games data');
        if (callback) {
            callback(sourceTVGamesResponse);
        }
        this.emit('SourceTVGamesResponse', sourceTVGamesResponse.games);
    }else {
        util.log('Received a bad SourceTV games response');
       // if (callback) {
       //     callback(sourceTVGamesResponse.result, sourceTVGamesResponse);
       // }
    }
};

//7074
/** message CMsgSpectateFriendGameResponse {
 *      optional fixed64 server_steamid = 4;
 *  }
 */
handlers[Dota2.EDOTAGCMsg.k_EMsgGCSpectateFriendGameResponse] = function onGCSpectateFriendGameResponse(message, callback) {

    //var callback = callback || null;
    var response = Dota2.CMsgSpectateFriendGameResponse.decode(message);
    debuglog(response, 'spectate friend game response');
    if (callback !== undefined){
        callback(response);
    }
};

//7402
handlers[Dota2.EDOTAGCMsg.k_EMsgDOTALiveLeagueGameUpdate] = function onDOTALiveLeagueGameUpdate(message, callback){
    callback = callback || null;
    var response = Dota2.CMsgDOTALiveLeagueGameUpdate.decode(message);
    debuglog(response, 'live league game update response');
    this.emit('DOTALiveLeagueGameUpdate', response.live_league_games);

};

//8010
handlers[Dota2.EDOTAGCMsg.k_EMsgGCToClientFindTopSourceTVGamesResponse] = function onGCToClientFindTopSourceTVGamesResponse(message, callback) {
    callback = callback || null;
    var topSourceTVGamesResponse = Dota2.CMsgGCToClientFindTopSourceTVGamesResponse.decode(message);
    debuglog(topSourceTVGamesResponse, 'topSourceTVGamesResponse');
    if (typeof topSourceTVGamesResponse.games != 'undefined' && topSourceTVGamesResponse.games.length > 0) {
        util.log('Received topSourceTV games data');
        if (callback) {
            callback(topSourceTVGamesResponse);
        }
    }else {
        util.log('Received a bad SourceTV games response');
        if (callback) {
            callback(topSourceTVGamesResponse.result, topSourceTVGamesResponse);
        }
    }
};
