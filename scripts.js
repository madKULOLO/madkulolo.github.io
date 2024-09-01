function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('Команда ' + text + ' скопирована, вставляй в чат!');
    }, function(err) {
        console.error('Деду руина, ошибка какая-та: ', err);
    });
}
