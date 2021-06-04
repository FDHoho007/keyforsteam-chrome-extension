chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let kfsPage = document.createElement("html");
                kfsPage.innerHTML = xhttp.responseText;
                let game_id = null;
                let scripts = kfsPage.getElementsByTagName("script");
                for(let i = 0; i<scripts.length; i++)
                    if(scripts[i].innerHTML.match("(var game_id=\")(.+)(\")")) {
                        game_id = scripts[i].innerHTML.match("(var game_id=\")(.+)(\")")[2];
                        break;
                    }
                if(game_id == null)
                    return;
                let xhttp2 = new XMLHttpRequest();
                xhttp2.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        port.postMessage(JSON.parse(xhttp2.responseText));
                    }
                };
                xhttp2.open("GET", "https://www.keyforsteam.de/wp-admin/admin-ajax.php?action=get_offers&product=" + game_id + "&currency=eur&region=&moreq=undefined&use_beta_offers_display=1", true);
                xhttp2.send();
            }
        };
        xhttp.open("GET", "https://www.keyforsteam.de/" + msg + "-key-kaufen-preisvergleich/", true);
        xhttp.send();
    });
});
