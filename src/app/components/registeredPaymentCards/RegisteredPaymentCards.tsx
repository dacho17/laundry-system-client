import { useEffect } from 'react';
import CONSTANTS from '../../../assets/constants';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import './RegisteredPaymentCards.css';
import { fetchPaymentCards } from '../../../services/slices/AccountSlice';
import LoadingComponent from '../loadingComponent/LoadingComponent';

export default function RegisteredPaymentCards() {
    const dispatch = useAppDispatch();
    const { currentPaymentCard, inactivePaymentCards, isFetchLoading, fetchResMsg} = useAppSelector(state => state.account);

    useEffect(() => {
        dispatch(fetchPaymentCards());   
    }, [dispatch]);

    function showPaymentCards() {
        return <>
            {currentPaymentCard && <>
                <div className='section-title margin-bottom-2'>
                    {CONSTANTS.curretPaymentMethodLabel}
                </div>
                <div className='section-text margin-bottom-1'>
                    {`${currentPaymentCard.lastFourDigits} - ${currentPaymentCard.cardHolderName}`}
                </div>
                <div className='section-text margin-bottom-3'>
                    {`Expires on: ${currentPaymentCard.expiryDate}`}
                </div>
            </>}
            {inactivePaymentCards && <>
                <div className='section-title margin-bottom-2'>
                    {CONSTANTS.inactivePaymentMethodsLabel}
                </div>
                <div id='inactive-payment-cards'>
                    {inactivePaymentCards.map((card, index) => {
                        return <div key={index}>
                            <div className='section-text margin-bottom-1'>
                                {`${card.lastFourDigits} - ${card.cardHolderName}`}
                            </div>
                            <div className='section-text margin-bottom-1'>
                                {`Expires on: ${card.expiryDate}`}
                            </div>
                        </div>}
                    )}
                </div>
            </>}
        </>
    }

    function showSectionContent() {
        if (fetchResMsg?.isError) return <div className='message-container-centered'>{fetchResMsg?.message}</div>
        else if (isFetchLoading) {
            return <LoadingComponent />
        } else if (currentPaymentCard || inactivePaymentCards) {
            if (currentPaymentCard === null) {
                return <div className='message-container-centered'>{CONSTANTS.noRegisteredPaymentCards}</div>
            } else return showPaymentCards();
        }  else {
            return <div className='message-container-centered'>{CONSTANTS.unanticipatedEvent}</div>
        }
    }

    return <div id='current-payment-information'>
        {showSectionContent()}
    </div>;
}