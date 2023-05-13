import { useState } from 'react';
import CONSTANTS from '../../../assets/constants';
import CtaButton from '../ctaButton/CtaButton';
import GenFormInput from '../genFormInput/GenFormInput';
import { MY, SG, TH, ID, PH, VN, LA, KH, MM, AU } from 'country-flag-icons/react/3x2';
import { validateEmail } from '../../utils/elementHelper';
import './AccountInfoForm.css';
import FormInputState from '../../../interfaces/formInputState';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { setFormResMessage, updateUserInfo } from '../../../services/slices/AccountSlice';
import UpdateUserInfoForm from '../../../dtos/UpdateUserInfoForm';
import DialCodeFormInput from '../dialCodeFormInput/DialCodeFormInput';
import CountryDialCode from '../../../dtos/CountryDialCode';
import { validateMobileNumber } from '../../utils/mobileNumberValidator';

interface AccountInfoFormProps {
    username: string;
    countryDialCode: string;
    mobileNumber: string;
    email: string;
}

const SUPPORTED_COUNTRIES = [
    { countryIcon: <MY />, dialCode: '+60' },
    { countryIcon: <SG />, dialCode: '+65' },
    { countryIcon: <TH />, dialCode: '+66' },
    { countryIcon: <ID />, dialCode: '+62' },
    { countryIcon: <PH />, dialCode: '+63' },
    { countryIcon: <VN />, dialCode: '+84' },
    { countryIcon: <LA />, dialCode: '+856' },
    { countryIcon: <KH />, dialCode: '+855' },
    { countryIcon: <MM />, dialCode: '+95' },
    { countryIcon: <AU />, dialCode: '+61' },
] as CountryDialCode[];

export default function AccountInfoForm(props: AccountInfoFormProps) {
    const dispatch = useAppDispatch();
    const { formResMsg, isFormLoading } = useAppSelector(state => state.account); 

    const [email, setEmail] = useState<FormInputState>({
        entered: props.email ?? '',
        isValid: true,
        isTouched: true,
    });

    const dialCode = props.countryDialCode !== null
            ? SUPPORTED_COUNTRIES.find((dc: CountryDialCode) => dc.dialCode === props.countryDialCode)
            : SUPPORTED_COUNTRIES[0];
    const [countryDialCode, setCountryDialCode] = useState<CountryDialCode>(dialCode!);

    const [mobileNumber, setMobileNumber] = useState<FormInputState>({
        entered: props.mobileNumber ?? '',
        isValid: true,
        isTouched: true,
    });

    function tryToSendForm() {
        dispatch(setFormResMessage(null));
        if (!validateEmail(email.entered) || !validateMobileNumber(countryDialCode.dialCode, mobileNumber.entered)) {
            dispatch(setFormResMessage({message: CONSTANTS.accountInfoFormIsInvalid, isError: true}));
            return;
        }

        const userInfoForm = {
            username: props.username,
            email: email.entered,
            countryDialCode: countryDialCode.dialCode,
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
            <div className='margin-bottom-2'>
                <div className='mobile-number-input-row'>
                    <DialCodeFormInput
                        countryDialCodes={SUPPORTED_COUNTRIES}
                        currentlySelectedDialCode={countryDialCode}
                        setSelectedDialCode={setCountryDialCode}/>
                    <GenFormInput
                        name='mobile-number'
                        setStateFn={setMobileNumber}
                        inputState={mobileNumber}
                        validationFn={(mobileNum: string) => validateMobileNumber(countryDialCode.dialCode, mobileNum)}
                        minWidth='160px'/>
                </div>
                {
                    !mobileNumber.isValid && mobileNumber.isTouched &&
                        <span className="gen-form-input__error-msg">{CONSTANTS.mobileNumberValidationError}</span>
                }
            </div>
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
