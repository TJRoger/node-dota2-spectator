# node dota2 spectator  
A node-steam plugin for Dota 2 Spectator Client.
## How to install
* download the package to your working directory
* run `npm install` in the working directory
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
### Try it out
* add your steam username and password in the config.js  
* add the auth-code from steam after first try to login
* then you can login from now on

 refer to the `example.js` for more
### How to extend
Write a `handler`.js then import it to the `index.js` 
## license
This script is release under MIT license. Refer to the [LICENSE](LICENSE) file for more information.
