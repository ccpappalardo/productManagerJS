export default class ticketDTO{

    constructor(ticket){
        this.id=ticket._id;
        this.codigo=ticket.code;
        this.fecha=ticket.purchase_datetime;
        this.precio=ticket.amount;
        this.cliente=ticket.purchaser;
        this.productos=ticket.products;
    }
} 