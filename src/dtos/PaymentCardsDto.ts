import PaymentCardDto from "./PaymentCardDto";

export default interface PaymentCardsDto {
    currentCard: PaymentCardDto;
    inactiveCards: PaymentCardDto[];
}
