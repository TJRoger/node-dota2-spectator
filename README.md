# node dota2 spectator  
[![NPM version](https://img.shields.io/npm/v/node-dota2-spectator.svg)](https://www.npmjs.com/package/node-dota2-spectator "View this project on NPM")
[![Dependency Status](https://img.shields.io/david/tjroger/node-dota2-spectator.svg)](https://david-dm.org/tjroger/node-dota2-spectator)  
A node-steam plugin for Dota 2 Spectator Client. Spectate dota2 games  
## How to install
- download the package to your working directory
- run `npm install steam` && `npm install` in the `node-dota2-spectator` directory
 
## How to use
### Initialiaztion
```
var steam = require('steam'),
    dota = require('dota'),
    bot = new steam.SteamClient(),
    user = new steam.SteamUser(bot),
    dota2GC = new steam.SteamGameCoordinator(bot, 570);
    dota2 = new dota.Dota2Client(bot, user, dota2GC, 570);
```
### How to use your old sentryfile(to avoid the one week trade limit)
I just found out that the old sentry file is a `sha1` fingerprint of the new sentry
- load old sentry
```
if (fs.existsSync('sentryfile/'+logOnDetails.account_name)){
    logOnDetails.sha_sentryfile  = fs.readFileSync('sentryfile/' + logOnDetails.account_name);
    util.log('sentry loaded');
}
```
- update sentry
```
var onUserUpdateMachineAuth = function onUserUpdateMachineAuth(sentry, callback){
    var sentryfile = crypto.createHash('sha1').update(sentry.bytes).digest();
    fs.writeFileSync('sentryfile/'+config.steam_user, sentryfile);
    util.log("sentryfile saved");
    callback({ sha_file: sentryfile });
}
```
Test result: old sentrys are accept by steam  
If you find out any problem, feel free to contact with [me](mailto: tjrogertj@gmail.com) or open an issue.

### Try it out
- add your steam username and password in the config.js  
- add the auth-code from steam after first try to login
- then you can login from now on

refer to the [`example.js`](example.js) for more
### How to extend
Write a `handler`.js then import it to the `index.js` 
## license
This script is release under MIT license. Refer to the [LICENSE](LICENSE) file for more information.
