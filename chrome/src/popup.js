document.addEventListener('DOMContentLoaded', function () {
    const dataUrlElement = document.getElementById('data-url');
    const optionsForm = document.getElementById('options-form');
    const resetBtn = document.getElementById('reset-btn');
    const messageElement = document.getElementById('message');

    // Load saved data url
    chrome.storage.local.get(['dataURL'], function (result) {
        if (result.dataURL) {
            dataUrlElement.value = result.dataURL;
        }
    });

    optionsForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // Save data url
        chrome.storage.local.set({ dataURL: dataUrlElement.value }, function () {
            messageElement.textContent = 'URL de données sauvegardée.';
        });
        setTimeout(function () {
            messageElement.textContent = '';
            window.close();
        }, 4000);
    });

    resetBtn.addEventListener('click', function () {
        // Remove the stored data url
        chrome.storage.local.remove('dataURL', function () {
            console.log('Data url cleared.');
            dataUrlElement.value = '';
            messageElement.textContent = "URL de données réinitialisée.";
        });
        // Clear the message and close the popup after 4 seconds
        setTimeout(function () {
            messageElement.textContent = '';
            window.close();
        }, 4000);
    });
});