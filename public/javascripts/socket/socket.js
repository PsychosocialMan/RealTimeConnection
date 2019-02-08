let socket = io();
socket.on('sendToClient', function (data) {
    document.getElementById("data").innerHTML = data;
    socket.emit('receivedFromClient', { my: 'От Клиента: ' + new Date() });
});