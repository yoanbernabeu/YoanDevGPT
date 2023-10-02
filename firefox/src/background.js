const DATA_URL = "https://raw.githubusercontent.com/yoanbernabeu/YoanDevGPT/main/data.json";

browser.runtime.onInstalled.addListener(() => {
    fetch(DATA_URL)
        .then((response) => response.json())
        .then((data) => {
            data.forEach((item, index) => {
                browser.contextMenus.create({
                    id: index.toString(),
                    title: item.title,
                    contexts: ["editable"],
                });
            });
        });

    browser.contextMenus.create({
        id: "parent",
        title: "YoanDevGPT",
        contexts: ["editable"],
    });
});

browser.contextMenus.onClicked.addListener((info, tab) => {
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
});