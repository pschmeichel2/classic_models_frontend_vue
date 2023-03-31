export default class OrderDetail {
    orderNumber = 0;
    productCode = '';
    quantityOrdered = 0;
    priceEach = 0.0;
    orderLineNumber = 0;
    productName = '';
    customerName = '';

    constructor(productCode, productName, quantityOrdered, priceEach) {
        this.productCode = productCode;
        this.productName = productName;
        this.quantityOrdered = quantityOrdered;
        this.priceEach = priceEach;
    }

    static from(oldOrderDetail) {
        var orderDetail = new OrderDetail(
            oldOrderDetail.productCode,
            oldOrderDetail.productName,
            oldOrderDetail.quantityOrdered,
            oldOrderDetail.priceEach);
        orderDetail.productName = oldOrderDetail.productName;
        orderDetail.orderLineNumber = oldOrderDetail.orderLineNumber;
        return orderDetail;
    }
}


