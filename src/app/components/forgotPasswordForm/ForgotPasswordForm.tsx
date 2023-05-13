import { useEffect, useState } from 'react';
import CONSTANTS from '../../../assets/constants';
import FormInputState from '../../../interfaces/formInputState';
import ResponseMessage from '../../../interfaces/responseMessage';
import './ForgotPasswordForm.css';
import { validateEmail } from '../../utils/elementHelper';
import ForgotPasswordFormDto from '../../../dtos/ForgotPasswordFormDto';
import { useAppDispatch } from '../../../services/store';
import { requestForgotPassword } from '../../../services/slices/AuthSlice';
import GenFormInput from '../genFormInput/GenFormInput';
import CtaButton from '../ctaButton/CtaButton';
import { useNavigate } from 'react-router-dom';


export default function ForgotPasswordForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [resMsg, setResMsg] = useState<ResponseMessage | null>(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [email, setEmail] = useState<FormInputState>({
        entered: '',
        isValid: false,
        isTouched: false,
    });

    useEffect(() => {
        const isFormCurValid = validateEmail(email.entered);
        setIsFormValid(isFormCurValid);
    }, [email]);

    function tryToSendForm() {
        setIsLoading(true);
        if (!(validateEmail(email.entered))) {
            setIsFormValid(false);
            setResMsg({
                message: CONSTANTS.pleaseInsertValidData,
                isError: true
            } as ResponseMessage);
            setIsLoading(false);
            return;
        }

        const forgotPasswordForm = {
            email: email.entered
        } as ForgotPasswordFormDto;

        dispatch(requestForgotPassword(forgotPasswordForm)).then(res => {
            setResMsg({
                message: res.payload as string,
                isError: res.meta.requestStatus === CONSTANTS.fulfilledLabel ? false : true
            });
            setIsLoading(false);
        });
    }

    return <div className='forgot-password-form-container'>
        <div className='form__title margin-bottom-3'>{CONSTANTS.forgotPasswordLabel}</div>
        <form className='forgot-password-form'>
            <GenFormInput
                name='email'
                setStateFn={setEmail}
                inputState={email}
                errMsg={CONSTANTS.emailValidationError}
                validationFn={validateEmail}/>
            <div id='to-login-row' className='margin-bottom-2'>
                <div
                    onClick={() => navigate(CONSTANTS.loginRoute)}
                    id='to-login-link'
                >
                        {CONSTANTS.toLoginPageLabel}
                </div>
            </div>
            <CtaButton
                label={CONSTANTS.requestPasswordLabel}
                actionFn={() => tryToSendForm()}
                isDisabled={!isFormValid || isLoading}/>
            {resMsg && <div className={`${resMsg.isError ? 'error-msg' : 'succ-msg'} margin-top-2`}>
                {resMsg.message}
            </div>}
        </form>
    </div>
}
