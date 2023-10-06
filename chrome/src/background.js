const DEFAULT_DATA_URL = "https://raw.githubusercontent.com/yoanbernabeu/YoanDevGPT/main/data.json";

chrome.runtime.onInstalled.addListener(setup);
chrome.runtime.onStartup.addListener(setup);

function setup() {
    // clear all context menus entries firstly
    chrome.contextMenus.removeAll(function() {
        chrome.storage.local.get('dataURL', data => {
            let DATA_URL = data.dataURL || DEFAULT_DATA_URL;

            fetch(DATA_URL)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        chrome.contextMenus.create({
                            id: index.toString(),
                            title: item.title,
                            contexts: ["editable"],
                            parentId: "parent",
                        });
                    });
                });

            chrome.contextMenus.create({
                id: "parent",
                title: "YoanDevGPT",
                contexts: ["editable"],
            });

            // Create a context menu to reset URL to default
            chrome.contextMenus.create({
                id: "reset",
                title: "Reset URL to default",
                contexts: ["browser_action"],
            });
        });
    });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.storage.local.get('dataURL', data => {
        let DATA_URL = data.dataURL || DEFAULT_DATA_URL;

        console.log(`URL de données actuelle : ${DATA_URL}`);

        if (info.menuItemId === "reset") {
            DATA_URL = DEFAULT_DATA_URL;
            chrome.storage.local.set({ dataURL: DATA_URL });
        } else {
            const index = parseInt(info.menuItemId);

            fetch(DATA_URL)
                .then((response) => response.json())
                .then((data) => {
                    const prompt = data[index].prompt;
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        function: setInputField,
                        args: [prompt],
                    });
                });
        }
    });
});

function setInputField(prompt) {
    document.activeElement.value = prompt;
}

chrome.storage.onChanged.addListener(function(changes) {
    for (let key in changes) {
        if (key === 'dataURL') {
            setup();
            break;
        }
    }
});