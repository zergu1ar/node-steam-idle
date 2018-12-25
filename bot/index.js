const log = require('../logger'),
    SteamUser = require('steam-user'),
    SteamTotp = require('steam-totp');

function init(config) {
    let responded = [],
        gamesToIdle = uniq(config.games_to_play);

    log('Init bot');
    log('Removed ' + parseInt(parseInt(gamesToIdle.length) - gamesToIdle.length) + ' games');

    if (gamesToIdle.length > 20) {
        log('To many games to idle. Limit 20');
        return false
    }

    let client = new SteamUser(null, {"promptSteamGuardCode": false});

    // methods
    client.logOn({
        'accountName': config.username,
        'password': config.password,
        'rememberPassword': true
    });

    client.on('loggedOn', () => {
        log('Logged on steam!');
        client.requestFreeLicense(gamesToIdle);
        log('Idle: ' + gamesToIdle.length + ' games, getting ' + (gamesToIdle.length * 24) + ' hours per day | ' + (gamesToIdle.length * 336) + ' hours per 2 weeks');
        client.gamesPlayed(gamesToIdle);
        if (config.silent === false) {
            client.setPersona(1)
        }
    });

    client.on('error', function (e) {
        log('Steam client error' + e);
        shutdown(1)
    });

    client.on('friendMessage', (steamid, message) => {
        if (config.send_auto_message === true && responded.indexOf(steamid.getSteamID64()) === -1) {
            responded.push(steamid.getSteamID64());
            client.chatMessage(steamid, config.auto_message)
        }
    });

    client.on('lobbyInvite', (inviterID, lobbyID) => {
        if (config.send_auto_message === true && responded.indexOf(steamid.getSteamID64()) === -1) {
            responded.push(inviterID.getSteamID64());
            client.chatMessage(steamid, config.auto_message)
        }
    });

    client.on('steamGuard', (domain, callback) => {
        callback(SteamTotp.getAuthCode(config.sg_shared_secret))
    });

    // functions
    function uniq(a) {
        return a.sort().filter(function (item, pos, ary) {
            return !pos || item !== ary[pos - 1]
        })
    }
}

module.exports = {
    init: init
};