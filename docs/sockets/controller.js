const TicketControl = require('../models/file-control');

const ticketControl = new TicketControl();


const socketController = (socket) => {
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('estado-actual', ticketControl.ultimos4);
    socket.emit('cola-tickets', ticketControl.tickets.length);
    socket.on('siguiente-ticket', ( payload, callback ) => {
        const siguiente = ticketControl.siguiente();
        socket.broadcast.emit('cola-tickets', ticketControl.tickets.length);
        callback(siguiente);
    });
    socket.on('atender-ticket', ({escritorio}, callback) => {
        if(!escritorio){
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }
        const ticket = ticketControl.atenderTicket(escritorio);
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        socket.broadcast.emit('cola-tickets', ticketControl.tickets.length);
        socket.emit('cola-tickets', ticketControl.tickets.length);
        if(!ticket){
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket
            });
        }
    });
}


module.exports = {
    socketController
}