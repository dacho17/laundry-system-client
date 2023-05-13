import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../services/store';
import ResponseMessage from '../../../interfaces/responseMessage';
import FormInputState from '../../../interfaces/formInputState';
import CONSTANTS from '../../../assets/constants';
import ResetPasswordFormDto from '../../../dtos/ResetPasswordFormDto';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { requestResetPassword } from '../../../services/slices/AuthSlice';
import GenFormInput from '../genFormInput/GenFormInput';
import CtaButton from '../ctaButton/CtaButton';
import './ResetPasswordForm.css';

export default function ResetPasswordForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams(); // expected to read passwordResetToken
    const passwordResetToken = searchParams.get('passwordResetToken');

    console.log(`passwordResetToken=${passwordResetToken}`);
    const [isLoading, setIsLoading] = useState(false);
    const [resMsg, setResMsg] = useState<ResponseMessage | null>(null);
    const [isFormValid, setIsFormValid] = useState(false);
    const [username, setUsername] = useState<FormInputState>({
        entered: '',
        isValid: false,
        isTouched: false,
    });
    const [password, setPassword] = useState<FormInputState>({
        entered: '',
        isValid: false,
        isTouched: false,
    });
    const [confirmedPassword, setConfirmedPassword] = useState<FormInputState>({
        entered: '',
        isValid: false,
        isTouched: false,
    });

    function validateUsername(username: string): boolean {
        return username.length > 5;
    }

    function validatePassword(password: string): boolean {
        return password.length > 5;
    }

    function validateConfirmedPassword(confPassword: string): boolean {
        return validatePassword(password.entered) && confPassword === password.entered;
    }

    useEffect(() => {
        const isFormCurValid = validateUsername(username.entered)
            && validatePassword(password.entered) && validateConfirmedPassword(confirmedPassword.entered);
        setIsFormValid(isFormCurValid);
    }, [username, password, confirmedPassword]);

    function tryToSendForm() {
        setIsLoading(true);
        if (!(validateUsername(username.entered)
            && validatePassword(password.entered) && validateConfirmedPassword(confirmedPassword.entered))) {
            setIsFormValid(false);
            setResMsg({
                message: CONSTANTS.pleaseInsertValidData,
                isError: true
            } as ResponseMessage);
            setIsLoading(false);
            return;
        }

        const resetPasswordForm = {
            username: username.entered,
            password: password.entered,
            passwordResetToken: passwordResetToken
        } as ResetPasswordFormDto;

        dispatch(requestResetPassword(resetPasswordForm)).then(res => {
            setResMsg({
                message: res.payload as string,
                isError: res.meta.requestStatus === CONSTANTS.fulfilledLabel ? false : true
            });
            setIsLoading(false);
        });
    }

    return <div className='reset-password-form-container'>
        <div className='form__title margin-bottom-3'>{CONSTANTS.resetPasswordLabel}</div>
        <form className='reset-password-form'>
            <GenFormInput
                name='username'
                setStateFn={setUsername}
                inputState={username}
                errMsg={CONSTANTS.usernameValidationError}
                validationFn={validateUsername}/>
            <GenFormInput
                name='password'
                setStateFn={setPassword}
                inputState={password}
                errMsg={CONSTANTS.passwordValidationError}
                validationFn={validatePassword}/>
            <GenFormInput
                name='confirm-password'
                setStateFn={setConfirmedPassword}
                inputState={confirmedPassword}
                errMsg={CONSTANTS.confirmedPasswordValidationError}
                validationFn={validateConfirmedPassword}/>
            <div id='to-login-row' className='margin-bottom-2'>
                <div
                    onClick={() => navigate(CONSTANTS.loginRoute)}
                    id='to-login-link'
                >
                        {CONSTANTS.toLoginPageLabel}
                </div>
            </div>
            <CtaButton
                label={CONSTANTS.resetPasswordLabel}
                actionFn={() => tryToSendForm()}
                isDisabled={!isFormValid || isLoading}/>
            {resMsg && <div className={`${resMsg.isError ? 'error-msg' : 'succ-msg'} margin-top-2`}>
                {resMsg.message ?? CONSTANTS.resetPasswordBadRequestError}
            </div>}
        </form>
    </div>;
}
