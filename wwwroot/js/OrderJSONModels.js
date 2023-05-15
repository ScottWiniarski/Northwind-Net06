class OrderJSON {
    constructor(customerEmail, orderDetails){
        this.customerEmail = customerEmail;
        this.orderDetails = orderDetails;
    }
}

class OrderDetailsJSON {
    constructor(productId, unitPrice, quantity, discount){
        this.productId = productId;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.discount = discount;
    }
}

export { OrderJSON, OrderDetailsJSON } 