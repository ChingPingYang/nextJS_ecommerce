const getTotalPrice = (products) => {
    const  total = products.reduce((acc, p) => {
        acc += p.product.price * p.quantity
        return acc
    }, 0);
    const cartTotal = ((total * 100) / 100).toFixed(2);
    const stripeTotal = Number((total * 100).toFixed(2));
    return {
        cartTotal,
        stripeTotal
    }
}

export default getTotalPrice;