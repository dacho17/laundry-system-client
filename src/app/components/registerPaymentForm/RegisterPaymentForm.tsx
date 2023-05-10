import { useState } from 'react';
import GenFormInput from '../genFormInput/GenFormInput';
import CtaButton from '../ctaButton/CtaButton';
import CONSTANTS from '../../../assets/constants';
import FormInputState from '../../../interfaces/formInputState';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import UpdatePaymentCardForm from '../../../dtos/UpdatePaymentCardForm';
import { setFormResMessage, updatePaymentCard } from '../../../services/slices/AccountSlice';
import './RegisterPaymentForm.css';
import ResponseMessage from '../../../interfaces/responseMessage';

export default function RegisterPaymentForm() {
    const dispatch = useAppDispatch();
    const { formResMsg, isFormLoading } = useAppSelector(state => state.account);

    const [cardNumber, setCardNumber] = useState<FormInputState>({
        entered: '',
        isValid: false,
        isTouched: false,
    });
    const [cardHolder, setCardHolder] = useState<FormInputState>({
        entered: '',
        isValid: false,
        isTouched: false,
    });
    const [cardExpiryDate, setcardExpiryDate] = useState<FormInputState>({
        entered: '',
        isValid: false,
        isTouched: false,
    });
    const [cardCVV, setCardCVV] = useState<FormInputState>({
        entered: '',
        isValid: false,
        isTouched: false,
    });
    
    // const [isLoading, setIsLoading] = useState(false);
    // const [resMsg, setResMsg] = useState<ResponseMessage | null>(null);

    function cardNumberValidation(cardNumber: string) {
        const isLengthValid = cardNumber.trim().length === 16;
        const isNumber = !isNaN(parseInt(cardNumber));

        return isLengthValid && isNumber;
    }

    function cardHolderValidation(cardHolder: string) {
        return cardHolder.trim().length > 3;
    }

    function cardExpiryDateValidation(cardExpiry: string) {
        const isLengthValid = cardExpiry.trim().length === 4;
        const isNumber = !isNaN(parseInt(cardExpiry));

        return isLengthValid && isNumber;
    }

    function cardCvvValidation(cvv: string) {
        const isLengthValid = cvv.trim().length === 3;
        const isNumber = !isNaN(parseInt(cvv));

        return isLengthValid && isNumber;
    }

    function tryToSendForm() {
        if (!cardNumberValidation(cardNumber.entered) || !cardHolderValidation(cardHolder.entered)
            || !cardExpiryDateValidation(cardExpiryDate.entered) || !cardCvvValidation(cardCVV.entered)) {
            dispatch(setFormResMessage({message: CONSTANTS.registerPaymentFormIsInvalid, isError: true}));
            return;
        }
        
        const paymentCardForm = {
            cardHolder: cardHolder.entered.trim(),
            cardNumber: cardNumber.entered.trim(),
            expiryDate: `${cardExpiryDate.entered.trim().slice(0, 2)}/${cardExpiryDate.entered.trim().slice(2)}`,
            cvv: cardCVV.entered.trim()
        } as UpdatePaymentCardForm;
        
        dispatch(updatePaymentCard(paymentCardForm));
    }

    return <div className='form-container'>
        <form className='register-payment-form'>
            {/* NOTE:: this form input is just a showcase it will be disabled and not sent */}
            <GenFormInput
                name='card-number'
                setStateFn={setCardNumber}
                inputState={cardNumber}
                errMsg={''}
                validationFn={cardNumberValidation}/>
            <GenFormInput
                name='card-holder'
                setStateFn={setCardHolder}
                inputState={cardHolder}
                errMsg={''}
                validationFn={cardHolderValidation}/>
            <div className='short-input-field margin-right-3'>
                <GenFormInput
                    name='card-expiry-date'
                    setStateFn={setcardExpiryDate}
                    inputState={cardExpiryDate}
                    errMsg={''}
                    validationFn={cardExpiryDateValidation}/>
            </div>
            <div className='short-input-field'>
                <GenFormInput
                    name='card-cvv'
                    setStateFn={setCardCVV}
                    inputState={cardCVV}
                    errMsg={''}
                    validationFn={cardCvvValidation}/>
            </div>
            <CtaButton
                label={CONSTANTS.registerCardLabel}
                actionFn={() => tryToSendForm()}
                isDisabled={isFormLoading}/>
            {formResMsg && <div className={`${formResMsg.isError ? 'error-msg' : 'succ-msg'} margin-top-2`}>
                {formResMsg.message}
            </div>}
        </form>
    </div>
}
