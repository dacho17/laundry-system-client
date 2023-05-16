export function convertPriceToPoints(price: number, currency: string) {
    switch(currency) {
        case "SGD":
            return Math.round(price * 3);
        case "USD":
            return Math.round(price * 5);
        case "MYR":
            return Math.round(price);
        default:
            throw new Error("Uknown currency encountered while converting to loyalty points");
    }
}
