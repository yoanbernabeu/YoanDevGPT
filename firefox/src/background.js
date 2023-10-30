const DEFAULT_DATA_URL = "https://raw.githubusercontent.com/yoanbernabeu/YoanDevGPT/main/data.json";

browser.runtime.onInstalled.addListener(setup);
browser.runtime.onStartup.addListener(setup);

function setup() {
    // clear all context menus entries firstly
    browser.contextMenus.removeAll().then(() => {
        browser.storage.local.get('dataURL').then(data => {
            let DATA_URL = data.dataURL || DEFAULT_DATA_URL;

            fetch(DATA_URL)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        browser.contextMenus.create({
                            id: index.toString(),
                            title: item.title,
                            contexts: ["editable"],
                            parentId: "parent",
                        });
                    });
                });

            browser.contextMenus.create({
                id: "parent",
                title: "YoanDevGPT",
                contexts: ["editable"],
            });

            // Create a context menu to reset URL to default
            browser.contextMenus.create({
                id: "reset",
                title: "Reset URL to default",
                contexts: ["browser_action"],
            });
        });
    });
}

browser.contextMenus.onClicked.addListener((info, tab) => {
    browser.storage.local.get('dataURL').then(data => {
        let DATA_URL = data.dataURL || DEFAULT_DATA_URL;

        console.log(`URL de données actuelle : ${DATA_URL}`);

        if (info.menuItemId === "reset") {
            DATA_URL = DEFAULT_DATA_URL;
            browser.storage.local.set({ dataURL: DATA_URL });
        } else {
            const index = parseInt(info.menuItemId);

            fetch(DATA_URL)
                .then((response) => response.json())
                .then((data) => {
                    const prompt = data[index].prompt;
                    browser.tabs.executeScript(
                        tab.id,
                        {
                            code: `document.activeElement.value = "${prompt}";`
                        }
                    );
                });
        }
    });
});

browser.storage.onChanged.addListener(function(changes) {
    for (let key in changes) {
        if (key === 'dataURL') {
            setup();
            break;
        }
    }
});