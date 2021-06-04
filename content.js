const APP_REGEX = "(https:\/\/store\.steampowered\.com\/app\/[0-9]+\/)(.+)(\/)";

function getGameName() {
    return location.href.match(APP_REGEX)[2].replaceAll("_", "-").replaceAll("II", "2").toLowerCase();
}

if (location.href.match(APP_REGEX)) {
    var port = chrome.runtime.connect();
    port.postMessage(getGameName());
    port.onMessage.addListener(function (msg) {
        if (msg["success"]) {
            console.log(msg);
            let lowestPrice = 0;
            let lowsetShop = null;
            for (let offer of msg["offers"])
                if ((lowsetShop == null || offer["price"]["eur"]["price"] < lowestPrice) && offer["stock"] == "InStock" && offer["platform"] == "steam") {
                    lowestPrice = offer["price"]["eur"]["price"];
                    lowsetShop = offer["affiliateUrl"];
                }
            let e = document.getElementsByClassName("game_purchase_action_bg")[0];
            let f = null;
            let elements = document.getElementsByClassName("game_purchase_discount");
            if (elements.length > 0 && elements[0].parentElement == e)
                f = elements[0].getElementsByClassName("discount_final_price")[0];
            else {
                let elements = document.getElementsByClassName("game_purchase_price");
                if (elements.length > 0 && elements[0].parentElement == e)
                    f = elements[0];
            }
            let div = document.createElement("div");
            if (f != null && lowsetShop != null) {
                let price = parseFloat(f.innerHTML.replaceAll("€", "").replaceAll(",", "."));
                if (lowestPrice < price) {
                    let a1 = document.createElement("a");
                    a1.innerText = (lowestPrice + "€").replaceAll("\.", ",");
                    a1.href = lowsetShop;
                    a1.target = "_blank";
                    a1.style.display = "inline-block";
                    a1.style.padding = "10px 0 0 12px";
                    a1.style.height = "24px";
                    div.appendChild(a1);
                    f.style.textDecoration = "line-through";
                }
            }
            let a2 = document.createElement("a");
            a2.href = "https://www.keyforsteam.de/" + getGameName() + "-key-kaufen-preisvergleich/";
            a2.target = "_blank";
            let img = document.createElement("img");
            img.src = "https://www.keyforsteam.de/wp-content/themes/aks-theme/assets/image/layout/banner-brand-logo.png";
            img.style.height = "20px";
            img.style.position = "relative";
            img.style.bottom = "-2px";
            img.style.marginLeft = "15px";
            if (f == null || f.classList.contains("discount_final_price"))
                img.style.marginRight = f == null ? "15px" : "12px";
            a2.appendChild(img);
            div.appendChild(a2);
            e.insertBefore(div, e.childNodes[0]);
        }
    });
}
