function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(function(err) {
        console.error('Дедус руина, дал жидкого. Ошибка: ', err);
    });
}
