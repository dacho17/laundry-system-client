export default interface LoyaltyOfferDto {
    id: number;
    name: string;
    loyaltyPoints: number
    price: number;
    currency: string;
    expiryDate: number;    
}
