async function getGameId(gameName) {
    let response = await fetch("https://www.keyforsteam.de/" + gameName + "-key-kaufen-preisvergleich/");
    let html = await response.text();
    let gameId = html.match("(var game_id=\")(.+?)(\")");
    return gameId ? gameId[2] : gameId;
}

async function getGamePrices(game_id) {
    let response = await fetch("https://www.keyforsteam.de/wp-admin/admin-ajax.php?action=get_offers&product=" + game_id + "&currency=eur&region=&moreq=undefined&use_beta_offers_display=1");
    return await response.json();
}

chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(async function(msg) {
        let gameId = await getGameId(msg);
        let gamePrices = await getGamePrices(gameId);
        port.postMessage(gamePrices);
    });
});