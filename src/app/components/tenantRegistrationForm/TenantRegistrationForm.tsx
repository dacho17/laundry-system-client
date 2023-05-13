import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAppDispatch, useAppSelector } from "../../../services/store";
import { useEffect, useState } from "react";
import FormInputState from "../../../interfaces/formInputState";
import { getCurrentDate, isDifferenceAtLeast30Days, validateEmail } from "../../utils/elementHelper";
import { setFormResMessage } from "../../../services/slices/AdminSlice";
import CONSTANTS from "../../../assets/constants";
import TenantRegistrationFormDto from "../../../dtos/TenantRegFormDto";
import { createNewTenant, setResetFormEntries, setUpdatedTenant, updateTenant } from "../../../services/slices/ResidenceAdminSlice";
import GenFormInput from "../genFormInput/GenFormInput";
import CtaButton from "../ctaButton/CtaButton";
import './TenantRegistrationForm.css';
import { RegistrationFormType } from "../../../enums/RegistrationFormType";
import Tenant from "../../../dtos/Tenant";
import CountryDialCode from "../../../dtos/CountryDialCode";
import { MY, SG, TH, ID, PH, VN, LA, KH, MM, AU } from 'country-flag-icons/react/3x2';
import DialCodeFormInput from "../dialCodeFormInput/DialCodeFormInput";
import { validateMobileNumber } from "../../utils/mobileNumberValidator";

function onInputChanged(event: { target: HTMLInputElement; }, didBlur: boolean, setStateFn: Function, validationFn: Function) {
    const enteredDate = event.target.value ? new Date(event.target.value) : new Date();
    setStateFn((prevState: any)=> {
        return {
            entered: enteredDate,
            isValid: validationFn(enteredDate),
            isTouched: prevState.isTouched || didBlur
        }
    });
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

interface TenantRegistrationFormProps {
    formType: RegistrationFormType;
}

export default function TenantRegistrationForm(props: TenantRegistrationFormProps) {
    const dispatch = useAppDispatch();
    const { resetForm, isFormLoading, formResMessage, updatedTenant } = useAppSelector(state => state.residenceAdmin);

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

    const [countryDialCode, setCountryDialCode] = useState<CountryDialCode>(SUPPORTED_COUNTRIES[0]);
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
    const [tenancyFrom, setTenancyFrom] = useState({
        entered: new Date(Date.now()),
        isValid: false,
        isTouched: false
    });
    const [tenancyTo, setTenancyTo] = useState({
        entered: new Date(Date.now()),
        isValid: false,
        isTouched: false
    });

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        if (resetForm) {
            setFormStates(null);
            dispatch(setResetFormEntries(false));
        }
        if (updatedTenant !== null && props.formType === RegistrationFormType.REGISTER) {
            dispatch(setUpdatedTenant(null));
            setFormStates(null)
        } if (updatedTenant !== null && username.entered !== updatedTenant.username
                && props.formType === RegistrationFormType.UPDATE) {
            setFormStates(updatedTenant);
        }
        const isFormCurValid = validateForm();
        setIsFormValid(isFormCurValid);
    }, [validateForm, resetForm, username, password, name, surname, email, mobileNumber, tenancyFrom, tenancyTo, updatedTenant, formResMessage]);


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

    function validateTenancyFromDate(date: Date): boolean {
        if (date == null) return false;
        if (props.formType === RegistrationFormType.UPDATE) return true;
        const currentDate = getCurrentDate();
        return currentDate.getTime() <= date.getTime();
    }

    function validateTenancyToDate(fromDate: Date, toDate: Date): boolean {
        if (fromDate == null || toDate == null) return false;
        return isDifferenceAtLeast30Days(fromDate, toDate);
    }

    function validateForm() {
        return validateUsername(username.entered) && validatePassword(password.entered)
            && validateName(name.entered) && validateName(surname.entered)
            && validateMobileNumber(countryDialCode.dialCode, mobileNumber.entered) && validateEmail(email.entered)
            && validateTenancyFromDate(tenancyFrom.entered) && validateTenancyToDate(tenancyFrom.entered, tenancyTo.entered);
    }

    function setFormStates(updTen: Tenant | null) {
        if (RegistrationFormType.REGISTER === props.formType) {
            updTen = null;
        }
        const isTouchedAndIsValidInit = {
            isTouched: updTen !== null ? true : false,
            isValid: updTen !== null ? true : false
        }
        setName((prevState) => {
            return {
                entered: updTen?.name || '',
                ...isTouchedAndIsValidInit
            }
        });
        setSurname((prevState) => {
            return {
                entered: updTen?.surname || '',
                ...isTouchedAndIsValidInit
            }
        });
        setUsername((prevState) => {
            return {
                entered: updTen?.username || '',
                ...isTouchedAndIsValidInit
            }
        });
        setPassword((prevState) => {
            return {
                entered: '',
                isTouched: false,
                isValid: false
            }
        });
        setEmail((prevState) => {
            return {
                entered: updTen?.email || '',
                ...isTouchedAndIsValidInit
            }
        });

        const dialCode = updTen !== null
            ? SUPPORTED_COUNTRIES.find((dc: CountryDialCode) => dc.dialCode === updTen!.countryDialCode)
            : SUPPORTED_COUNTRIES[0];
        setCountryDialCode(dialCode!);
        setMobileNumber((prevState) => {
            return {
                entered: updTen?.mobileNumber || '',
                ...isTouchedAndIsValidInit
            }
        });
        setTenancyFrom((prevState) => {
            return {
                entered: new Date(updTen?.tenancyFrom || Date.now()),
                ...isTouchedAndIsValidInit
            }
        });
        setTenancyTo((prevState) => {
            return {
                entered: new Date(updTen?.tenancyTo || Date.now()),
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
            countryDialCode: countryDialCode.dialCode,
            mobileNumber: mobileNumber.entered,
            tenancyFrom: tenancyFrom.entered,
            tenancyTo: tenancyTo.entered
        } as TenantRegistrationFormDto;

        if (props.formType === RegistrationFormType.REGISTER) {
            dispatch(createNewTenant(registrationForm)).then(res => {
                if (res.meta.requestStatus === CONSTANTS.fulfilledLabel) {
                    dispatch(setUpdatedTenant(null));
                    setFormStates(null);
                }
            });
        } else {
            dispatch(updateTenant(registrationForm)).then(res => {
                if (res.meta.requestStatus === CONSTANTS.fulfilledLabel) {
                    dispatch(setUpdatedTenant(null));
                    setFormStates(null);
                }
            });;
        }
    }

    const title = RegistrationFormType.REGISTER === props.formType ? CONSTANTS.registerTenantLabel : CONSTANTS.updateTenantLabel;
    const buttonLabel = RegistrationFormType.REGISTER === props.formType ? CONSTANTS.registerLabel : CONSTANTS.updateLabel;
    
    return <div className='tenant-registration-form-container'>
        <div className='form__title margin-bottom-3'>{title}</div>
        <form className='tenant-registration-form'>
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
            
            <div className='datepicker-container'>
                <div className='datepicker__label margin-bottom-1'>{CONSTANTS.fromLabel}</div>
                <DatePicker
                    selected={tenancyFrom.entered}
                    disabled={RegistrationFormType.UPDATE === props.formType}
                    onBlur={(event) => onInputChanged(event, true, setTenancyFrom, validateTenancyFromDate)}
                    onChange={(date) => setTenancyFrom((prevState: any) => {
                        const enteredDate = date ? new Date(date) : new Date();
                        return {
                            entered: enteredDate,
                            isValid: validateTenancyFromDate(enteredDate),
                            isTouched: prevState.isTouched
                        }
                    })} //only when value has changed
                    />
                { tenancyFrom.isTouched && !tenancyFrom.isValid &&
                    <span className="gen-form-input__error-msg">{CONSTANTS.dateMustNotBeInPast}</span>}
            </div>
            <div className='datepicker-container'>
                <div className='datepicker__label margin-bottom-1'>{CONSTANTS.untilLabel}</div>
                <DatePicker
                    selected={tenancyTo.entered}
                    onBlur={(event) => onInputChanged(event, true, setTenancyTo, validateTenancyToDate)}
                    onChange={(date) => setTenancyTo((prevState: any) => {
                        const enteredDate = date ? new Date(date) : new Date();
                        return {
                            entered: enteredDate,
                            isValid: validateTenancyToDate(tenancyFrom.entered, enteredDate),
                            isTouched: prevState.isTouched
                        }
                    })}
                />
                { tenancyTo.isTouched && !tenancyTo.isValid &&
                <span className="gen-form-input__error-msg">{CONSTANTS.tenancyMustBeAtLeastOneMonth}</span>}
            </div>
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
