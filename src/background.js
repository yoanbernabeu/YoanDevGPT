const DATA_URL = "https://raw.githubusercontent.com/yoanbernabeu/YoanDevGPT/main/data.json";

chrome.runtime.onInstalled.addListener(() => {
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
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
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
});

function setInputField(prompt) {
    document.activeElement.value = prompt;
}
