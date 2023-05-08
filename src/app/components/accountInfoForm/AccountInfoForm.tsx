import { useState } from 'react';
import CONSTANTS from '../../../assets/constants';
import CtaButton from '../ctaButton/CtaButton';
import GenFormInput from '../genFormInput/GenFormInput';
import { validateEmail, validateMobileNumberDUMMY } from '../../utils/elementHelper';
import './AccountInfoForm.css';
import FormInputState from '../../../interfaces/formInputState';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { setFormResMessage, updateUserInfo } from '../../../services/slices/AccountSlice';
import UpdateUserInfoForm from '../../../dtos/UpdateUserInfoForm';
import ResponseMessage from '../../../interfaces/responseMessage';

interface AccountInfoFormProps {
    username: string;
    mobileNumber: string;
    email: string;
}

export default function AccountInfoForm(props: AccountInfoFormProps) {
    const dispatch = useAppDispatch();
    const { formResMsg, isFormLoading } = useAppSelector(state => state.account); 

    const [email, setEmail] = useState<FormInputState>({
        entered: props.email ?? '',
        isValid: true,
        isTouched: true,
    });
    const [mobileNumber, setMobileNumber] = useState<FormInputState>({
        entered: props.mobileNumber ?? '',
        isValid: true,
        isTouched: true,
    });

    function tryToSendForm() {
        dispatch(setFormResMessage(null));
        if (!validateEmail(email.entered) || !validateMobileNumberDUMMY(mobileNumber.entered)) {
            dispatch(setFormResMessage({message: CONSTANTS.formIsInvaildMsg, isError: true}));
            return;
        }
        
        const userInfoForm = {
            username: props.username,
            email: email.entered,
            mobileNumber: mobileNumber.entered
        } as UpdateUserInfoForm;
        
        dispatch(updateUserInfo(userInfoForm));
    }

    return <div className='form-container'>
        <form className='account-info-form'>
            {/* NOTE:: this form input is just a showcase. 3rd party form will be used for payments */}
            <GenFormInput
                name='username'
                setStateFn={() => {}}
                inputState={{entered: props.username, isTouched: true, isValid: true} as FormInputState}
                errMsg={''}
                validationFn={() => true}
                disabled={true}/>
            <GenFormInput
                name='email'
                setStateFn={setEmail}
                inputState={email}
                errMsg={''}
                validationFn={validateEmail}/>
            <GenFormInput
                name='mobile-number'
                setStateFn={setMobileNumber}
                inputState={mobileNumber}
                errMsg={''}
                validationFn={validateMobileNumberDUMMY}/>
            <CtaButton
                label={CONSTANTS.updateLabel}
                actionFn={() => tryToSendForm()}
                isDisabled={isFormLoading}/>
            {formResMsg && <div className={`${formResMsg.isError ? 'error-msg' : 'succ-msg'} margin-top-2`}>
                {formResMsg.message}
            </div>}
        </form>
    </div>
}
