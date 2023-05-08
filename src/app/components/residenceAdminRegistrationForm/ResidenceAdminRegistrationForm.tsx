import { useAppDispatch, useAppSelector } from "../../../services/store";
import { useEffect, useState } from "react";
import FormInputState from "../../../interfaces/formInputState";
import { validateEmail, validateMobileNumberDUMMY } from "../../utils/elementHelper";
import { setFormResMessage } from "../../../services/slices/AdminSlice";
import CONSTANTS from "../../../assets/constants";
import { createNewResidenceAdmin, setUpdatedResidenceAdmin, updateResidenceAdmin } from "../../../services/slices/ResidenceAdminSlice";
import GenFormInput from "../genFormInput/GenFormInput";
import CtaButton from "../ctaButton/CtaButton";
import { RegistrationFormType } from "../../../enums/RegistrationFormType";
import ResidenceAdminRegFormDto from "../../../dtos/ResidenceAdminRegFormDto";
import './ResidenceAdminRegistrationForm.css';
import ResidenceAdmin from "../../../dtos/ResidenceAdmin";

interface ResidenceAdminRegistrationFormProps {
    formType: RegistrationFormType;
}

export default function ResidenceAdminRegistrationForm(props: ResidenceAdminRegistrationFormProps) {
    const dispatch = useAppDispatch();
    const { isFormLoading, formResMessage, updatedResidenceAdmin } = useAppSelector(state => state.residenceAdmin);

    const [name, setName] = useState<FormInputState>({
        entered: '',
        isValid: false,
        isTouched: false,
    });
    const [surname, setSurname] = useState<FormInputState>({
        entered: '',
        isValid: false,
        isTouched: false,
    });
    const [email, setEmail] = useState<FormInputState>({
        entered: '',
        isValid: false,
        isTouched: false,
    });
    const [mobileNumber, setMobileNumber] = useState<FormInputState>({
        entered: '',
        isValid: false,
        isTouched: false,
    });

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
        if (updatedResidenceAdmin !== null && props.formType === RegistrationFormType.REGISTER) {
            dispatch(setUpdatedResidenceAdmin(null));
            setFormStates(null);
        } else if (updatedResidenceAdmin !== null && username.entered !== updatedResidenceAdmin.username
            && props.formType === RegistrationFormType.UPDATE) {
            setFormStates(updatedResidenceAdmin);
        }

        const isFormCurValid = validateForm();
        setIsFormValid(isFormCurValid);
    }, [validateForm, username, password, name, surname, email, mobileNumber, updateResidenceAdmin, formResMessage]);


    function validateUsername(username: string): boolean {
        return username.trim().length > 5;
    }

    function validatePassword(password: string): boolean {
        if (props.formType === RegistrationFormType.UPDATE) return true;  // no password is being sent for update form
        return password.trim().length > 5;
    }

    function validateName(nameComp: string): boolean {
        return nameComp.trim().length >= 2;
    }

    function validateForm() {
        return validateUsername(username.entered) && validatePassword(password.entered)
            && validateName(name.entered) && validateName(surname.entered)
            && validateMobileNumberDUMMY(mobileNumber.entered) && validateEmail(email.entered);
    }

    function setFormStates(updResAdmin: ResidenceAdmin | null) {
        const isTouchedAndIsValidInit = {
            isTouched: updResAdmin !== null ? true : false,
            isValid: updResAdmin !== null ? true : false
        }
        setName((prevState) => {
            return {
                entered: updResAdmin?.name || '',
                ...isTouchedAndIsValidInit
            }
        });
        setSurname((prevState) => {
            return {
                entered: updResAdmin?.surname || '',
                ...isTouchedAndIsValidInit
            }
        });
        setUsername((prevState) => {
            return {
                entered: updResAdmin?.username || '',
                ...isTouchedAndIsValidInit
            }
        });
        setEmail((prevState) => {
            return {
                entered: updResAdmin?.email || '',
                ...isTouchedAndIsValidInit
            }
        });
        setMobileNumber((prevState) => {
            return {
                entered: updResAdmin?.mobileNumber || '',
                ...isTouchedAndIsValidInit
            }
        });
    }

    function tryToSendForm() {
        if (!(validateForm())) {
            setIsFormValid(false);
            dispatch(setFormResMessage(CONSTANTS.pleaseInsertValidData));
            return;
        }

        const registrationForm = {
            name: name.entered,
            surname: surname.entered,
            username: username.entered,
            password: password.entered,
            email: email.entered,
            mobileNumber: mobileNumber.entered,
        } as ResidenceAdminRegFormDto;

        if (props.formType === RegistrationFormType.REGISTER) {
            dispatch(createNewResidenceAdmin(registrationForm));
        } else {
            dispatch(updateResidenceAdmin(registrationForm));
        }
    }

    const title = RegistrationFormType.REGISTER === props.formType ? CONSTANTS.registerResidenceAdminLabel : CONSTANTS.updateResidenceAdminLabel;
    const buttonLabel = RegistrationFormType.REGISTER === props.formType ? CONSTANTS.registerLabel : CONSTANTS.updateLabel;
    return <div className='residence-admin-registration-form-container'>
        <div className='form__title margin-bottom-3'>{title}</div>
        <form className='residence-admin-registration-form'>
            <GenFormInput
                name='name'
                setStateFn={setName}
                inputState={name}
                errMsg={CONSTANTS.nameValidationError}
                validationFn={validateName}/>
            <GenFormInput
                name='surname'
                setStateFn={setSurname}
                inputState={surname}
                errMsg={CONSTANTS.nameValidationError}
                validationFn={validateName}/>
            <GenFormInput
                name='email'
                setStateFn={setEmail}
                inputState={email}
                errMsg={CONSTANTS.emailValidationError}
                validationFn={validateEmail}/>
            <GenFormInput
                name='mobileNumber'
                setStateFn={setMobileNumber}
                inputState={mobileNumber}
                errMsg={CONSTANTS.mobileNumberValidationError}
                validationFn={validateMobileNumberDUMMY}/>
            <GenFormInput
                name='username'
                setStateFn={setUsername}
                inputState={username}
                errMsg={CONSTANTS.usernameValidationError}
                validationFn={validateUsername}
                disabled={RegistrationFormType.UPDATE === props.formType}/>
            {RegistrationFormType.REGISTER === props.formType && <GenFormInput
                name='password'
                setStateFn={setPassword}
                inputState={password}
                errMsg={CONSTANTS.passwordValidationError}
                validationFn={validatePassword}/>}
            <CtaButton
                label={buttonLabel}
                actionFn={() => tryToSendForm()}
                isDisabled={!isFormValid || isFormLoading}/>
            {formResMessage && <div className={`${formResMessage.isError ? 'error-msg' : 'succ-msg'} margin-top-2`}>
                {formResMessage.message}
            </div>}
        </form>
    </div>
}
