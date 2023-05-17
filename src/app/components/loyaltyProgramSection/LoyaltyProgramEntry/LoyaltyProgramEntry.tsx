import { useState } from "react";
import CONSTANTS from "../../../../assets/constants";
import LoyaltyOfferDto from "../../../../dtos/LoyaltyOfferDto";
import { formatDate } from "../../../utils/elementHelper";
import CtaButton from "../../ctaButton/CtaButton";
import { useAppDispatch, useAppSelector } from "../../../../services/store";
import Popup from "../../popup/Popup";
import { purchaseLoyaltyOffer, setPopupResMessage } from "../../../../services/slices/AccountSlice";
import PurchaseLoyaltyOfferDto from "../../../../dtos/PurchaseLoyaltyOfferDto";
import './LoyaltyProgramEntry.css';
import { setLoyaltyPoints } from "../../../../services/slices/AuthSlice";

interface LoayltyProgramEntryProps {
    loyaltyOffer: LoyaltyOfferDto;
    isMobileDeviceView: boolean;
    headerLabels: string[];
}

export default function LoyaltyProgramEntry({loyaltyOffer, isMobileDeviceView, headerLabels}: LoayltyProgramEntryProps) {
    const [isPopupShown, setIsPopupShown] = useState(false);
    const { isPopupLoading, popupResMsg } = useAppSelector(state => state.account);
    const { user } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    function handlePopupClose() {
        dispatch(setPopupResMessage(null));
        setIsPopupShown(false);
    }

    function handlePurchaseOffer() {
        const purchaseRequest = {
            loyaltyOfferId: loyaltyOffer.id
        } as PurchaseLoyaltyOfferDto;

        dispatch(purchaseLoyaltyOffer(purchaseRequest)).then(res => {
            if (res.meta.requestStatus === CONSTANTS.fulfilledLabel) {
                const currentPointBalance = user!.loyaltyPoints;
                const newPointBalance = currentPointBalance + loyaltyOffer.loyaltyPoints;
                dispatch(setLoyaltyPoints(newPointBalance));
            }
        });
        
    }

    function showPopup() {
        const contentMsg = `You are about to purchase ${loyaltyOffer.name} offer and receive ${loyaltyOffer.loyaltyPoints} points.\n\nYour card will be charged with ${loyaltyOffer.price.toFixed(2)} ${loyaltyOffer.currency}.\n\n\nPlease confirm your payment.`;

        return isPopupShown && <Popup
            buttonLabel={CONSTANTS.confirmPaymentLabel}
            title={CONSTANTS.paymentConfirmationTitleLabel}
            content={contentMsg}
            errorMsg={popupResMsg?.isError ? popupResMsg.message : undefined}
            closePopupFn={() => handlePopupClose()}
            actionFn={() => handlePurchaseOffer()}
            isLoading={isPopupLoading}
            successMsg={popupResMsg?.isError === false ? popupResMsg.message : undefined}
        />
    }

    const expiryDate = new Date(loyaltyOffer.expiryDate);
        if (!isMobileDeviceView) {
            return <div className='loyalty-program-table__entry'>
                <div className='loyalty-program-table__item'>{loyaltyOffer.name}</div>
                <div className='loyalty-program-table__item'>{loyaltyOffer.loyaltyPoints}</div>
                <div className='loyalty-program-table__item'>{`${loyaltyOffer.price.toFixed(2)} ${loyaltyOffer.currency}`}</div>
                <div className='loyalty-program-table__item'>{formatDate(expiryDate)}</div>
                <div className='loyalty-program-table__item'><CtaButton 
                    isDisabled={false}
                    label={CONSTANTS.buyLabel}
                    actionFn={() => setIsPopupShown(true)}/>
                </div>
                {isPopupShown && showPopup()}
            </div>
        } else {
            return <div className='loyalty-program-table__entry'>
                <div className='loyalty-program-table__item'>{headerLabels[0]}: {loyaltyOffer.name}</div>
                <div className='loyalty-program-table__item'>{headerLabels[1]}: {loyaltyOffer.loyaltyPoints}</div>
                <div className='loyalty-program-table__item'>{headerLabels[2]}: {`${loyaltyOffer.price.toFixed(2)} ${loyaltyOffer.currency}`}</div>
                <div className='loyalty-program-table__item'>{headerLabels[3]}: {formatDate(expiryDate)}</div>
                <div className='loyalty-program-table__item'><CtaButton 
                    isDisabled={false}
                    label={CONSTANTS.buyLabel}
                    actionFn={() => setIsPopupShown(true)}/>
                </div>
                {isPopupShown && showPopup()}
                <hr className='loyalty-program-table__delimiter' />
            </div>
        }
}