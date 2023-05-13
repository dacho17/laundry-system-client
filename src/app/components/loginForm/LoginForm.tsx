import { useEffect, useState } from 'react';
import CONSTANTS from '../../../assets/constants';
import GenFormInput from '../genFormInput/GenFormInput';
import CtaButton from '../ctaButton/CtaButton';
import './LoginForm.css';
import FormInputState from '../../../interfaces/formInputState';
import { useAppDispatch, useAppSelector } from '../../../services/store';
import { logIn, setAuthErrorMsg } from '../../../services/slices/AuthSlice';
import TenantAuthForm from '../../../dtos/TenantAuthForm'; 
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
    const dispatch = useAppDispatch();
    const { isLoading, authErrorMsg } = useAppSelector(state => state.auth);
    const navigate = useNavigate();

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
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const isFormCurValid = validateUsername(username.entered) && validatePassword(password.entered);
        setIsFormValid(isFormCurValid);
    }, [username, password, navigate]);

    function validateUsername(username: string): boolean {
        return username.length > 5;
    }

    function validatePassword(password: string): boolean {
        return password.length > 5;
    }

    function tryToSendForm() {
        if (!(validateUsername(username.entered) && validatePassword(password.entered))) {
            setIsFormValid(false);
            dispatch(setAuthErrorMsg(CONSTANTS.pleaseInsertValidData));
            return;
        }

        const loginForm = {
            username: username.entered,
            password: password.entered
        } as TenantAuthForm;

        dispatch(logIn(loginForm));
    }

    return <div className='login-form-container'>
        <div className='form__title margin-bottom-3'>{CONSTANTS.loginLabel}</div>
        <form className='login-form'>
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

            <div id='forgot-password-row' className='margin-bottom-2'>
                <div
                    onClick={() => navigate(CONSTANTS.forgotPasswordRoute)}
                    id='forgot-password-link'
                >
                        {CONSTANTS.fogotMyPassword}
                </div>
            </div>
            <CtaButton
                label={CONSTANTS.loginLabel}
                actionFn={() => tryToSendForm()}
                isDisabled={!isFormValid || isLoading}/>
            {authErrorMsg && <div className='error-msg margin-top-2'>
                {authErrorMsg}
            </div>}
        </form>
    </div>
}
