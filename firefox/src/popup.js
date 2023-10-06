document.addEventListener('DOMContentLoaded', function () {
    const dataUrlElement = document.getElementById('data-url');
    const optionsForm = document.getElementById('options-form');
    const resetBtn = document.getElementById('reset-btn');
    const messageElement = document.getElementById('message');

    // Load saved data url
    browser.storage.local.get('dataURL').then(function (result) {
        if (result.dataURL) {
            dataUrlElement.value = result.dataURL;
        }
    });

    optionsForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // Save data url
        browser.storage.local.set({ dataURL: dataUrlElement.value }).then(function () {
            messageElement.textContent = 'URL de données sauvegardée.';
        });
        setTimeout(function () {
            messageElement.textContent = '';
            window.close();
        }, 4000);
    });

    resetBtn.addEventListener('click', function () {
        // Remove the stored data url
        browser.storage.local.remove('dataURL').then(function () {
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