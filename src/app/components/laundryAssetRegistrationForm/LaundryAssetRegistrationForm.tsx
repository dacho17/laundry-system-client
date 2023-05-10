import { useAppDispatch, useAppSelector } from "../../../services/store";
import { useEffect, useState } from "react";
import FormInputState from "../../../interfaces/formInputState";
import { setFormResMessage } from "../../../services/slices/ResidenceAdminSlice";
import CONSTANTS from "../../../assets/constants";
import { createNewLaundryAsset, setUpadatedLaundryAsset, updateLaundryAsset,} from "../../../services/slices/ResidenceAdminSlice";
import GenFormInput from "../genFormInput/GenFormInput";
import CtaButton from "../ctaButton/CtaButton";
import { RegistrationFormType } from "../../../enums/RegistrationFormType";
import { AssetType, getAssetType } from "../../../enums/AssetType";
import LaundryAssetDto from "../../../dtos/LaundryAssetDto";
import LaundryAssetRegFormDto from "../../../dtos/LaundryAssetRegFormDto";
import CurrencyDropdown from "../currencyDropdown/CurrencyDropdown";
import './LaundryAssetRegistrationForm.css';

interface LaundryAssetRegistrationFormProps {
    formType: RegistrationFormType;
}

export default function LaundryAssetRegistrationForm(props: LaundryAssetRegistrationFormProps) {
    const dispatch = useAppDispatch();
    const { isFormLoading, formResMessage, updatedLaundryAsset } = useAppSelector(state => state.residenceAdmin);

    const [assetId, setAssetId] = useState(0);
    const [name, setName] = useState<FormInputState>({
        entered: '',
        isValid: false,
        isTouched: false,
    });
    const [runningTime, setRunningTime] = useState<FormInputState>({
        entered: '',
        isValid: false,
        isTouched: false,
    });
    const [servicePrice, setServicePrice] = useState<FormInputState>({
        entered: '',
        isValid: false,
        isTouched: false,
    });
    const [currency, setCurrency] = useState<string>(CONSTANTS.defaultDropdownCurrency);
    const [assetType, setAssetType] = useState<AssetType>(AssetType.WASHER);
    const [isOperational, setIsOperational] = useState<boolean>(false);

    console.log(JSON.stringify(`Current state status: assetType=${assetType}, currency=${currency}, isOperational=${isOperational}`));
    // console.log(JSON.stringify(updatedLaundryAsset));
    const [isFormValid, setIsFormValid] = useState(false);
    console.log(`Current resMessage=${JSON.stringify(formResMessage)}`);
    useEffect(() => {
        if (updatedLaundryAsset !== null && props.formType === RegistrationFormType.REGISTER) {
            dispatch(setUpadatedLaundryAsset(null));
            setFormStates(null);
        } else if (updatedLaundryAsset !== null && assetId !== updatedLaundryAsset.id
            && props.formType === RegistrationFormType.UPDATE) {
            setFormStates(updatedLaundryAsset);
        }

        const isFormCurValid = validateForm();
        setIsFormValid(isFormCurValid);
    }, [validateForm, runningTime, servicePrice, name, assetType, currency, isOperational, updatedLaundryAsset, formResMessage]);

    function validateName(name: string): boolean {
        return name.trim().length >= 2;
    }

    function validateAsssetType(assetType: number) {
        const type = getAssetType(assetType)
        return type === AssetType.DRYER || type === AssetType.WASHER;
    }

    function validateRunningTime(runningTime: string) {
        let runningTimeNum = parseInt(runningTime);
        if (isNaN(runningTimeNum)) return false;
        return runningTimeNum > 0;
    }

    function validateServicePrice(price: string) {
        let priceNum = parseFloat(price);
        if (isNaN(priceNum)) return false;
        return priceNum > 0;
    }

    function validateCurrency(currency: string) {
        return currency !== null && CONSTANTS.supportedCurrencies.includes(currency);
    }

    function validateIsOperational(isOperational: boolean) {
        return isOperational === true || isOperational === false;
    }

    function validateForm() {
        return validateName(name.entered) && validateAsssetType(assetType)
            && validateServicePrice(servicePrice.entered) && validateCurrency(currency)
            && validateRunningTime(runningTime.entered) && validateIsOperational(isOperational);
    }

    function setFormStates(updLaundryAsset: LaundryAssetDto | null) {
        setAssetId((prevState) => updLaundryAsset?.id || prevState);
        setName((prevState) => {
            return {
                entered: updLaundryAsset?.name || '',
                isTouched: updLaundryAsset ? true : false,
                isValid: updLaundryAsset ? true : false
            }
        });

        setAssetType(updLaundryAsset ? getAssetType(updLaundryAsset.assetType) : AssetType.WASHER);
        setServicePrice((prevState) => {
            return {
                entered: updLaundryAsset?.servicePrice || '',
                isTouched: updLaundryAsset ? true : false,
                isValid: updLaundryAsset ? true : false,
            }
        });
        setCurrency(updLaundryAsset?.currency || CONSTANTS.defaultDropdownCurrency);
        setRunningTime((prevState) => {
            return {
                entered: updLaundryAsset?.runningTime.toString() || '',
                isTouched: updLaundryAsset ? true : false,
                isValid: updLaundryAsset ? true : false,
            }
        });
        setIsOperational(updLaundryAsset?.isOperational || false);
    }

    function tryToSendForm() {
        if (!(validateForm())) {
            setIsFormValid(false);
            dispatch(setFormResMessage(CONSTANTS.pleaseInsertValidData));
            return;
        }

        const registrationForm = {
            id: updatedLaundryAsset?.id,
            name: name.entered,
            assetType: getAssetType(assetType),
            currency: currency,
            servicePrice: parseFloat(servicePrice.entered),
            isOperational: isOperational,
            runningTime: parseInt(runningTime.entered)
        } as LaundryAssetRegFormDto;

        if (props.formType === RegistrationFormType.REGISTER) {
            dispatch(createNewLaundryAsset(registrationForm)).then(res => {
                if (res.meta.requestStatus === CONSTANTS.fulfilledLabel) {
                    setFormStates(null);
                }
            });
        } else {
            dispatch(updateLaundryAsset(registrationForm)).then(res => {
                if (res.meta.requestStatus === CONSTANTS.fulfilledLabel) {
                    setFormStates(null);
                }
            });
        }
    }
 
    const title = RegistrationFormType.REGISTER === props.formType ? CONSTANTS.registerLaundryAssetLabel : CONSTANTS.updateLaundryAssetLabel;
    const buttonLabel = RegistrationFormType.REGISTER === props.formType ? CONSTANTS.registerLabel : CONSTANTS.updateLabel;
    return <div className='laundry-asset-registration-form-container'>
        <div className='form__title margin-bottom-3'>{title}</div>
        <form className='laundry-asset-registration-form'>
            <GenFormInput
                name='name'
                setStateFn={setName}
                inputState={name}
                errMsg={CONSTANTS.nameValidationError}
                validationFn={validateName}/>
            { RegistrationFormType.REGISTER === props.formType && 
                <fieldset id="asset-type-rb-group" className="margin-bottom-2">
                    <legend>{CONSTANTS.selectAssetTypeLabel}</legend>
                    <label htmlFor="washer-button">{CONSTANTS.washerLabel}</label>
                    <input id='washer-button' className='margin-right-3'
                        type="radio"
                        value={AssetType.WASHER} name="washer-button"
                        checked={AssetType.WASHER === getAssetType(assetType)}
                        onChange={(event) => setAssetType(AssetType.WASHER)}/>
                    <label htmlFor="drier-button">{CONSTANTS.drierLabel}</label>
                    <input id="drier-button" type="radio" value={AssetType.DRYER} name="drier-button"
                        checked={AssetType.DRYER === getAssetType(assetType)}
                        onChange={(event) => setAssetType(AssetType.DRYER)}/>
                </fieldset>            
            }
            <div className="laundry-asset-registration-form__row margin-bottom-2">
                <input type="checkbox" id="is-operational-checkbox" name="is-operational"
                    checked={isOperational}
                    onChange={() => setIsOperational(!isOperational)} />
                <label htmlFor="is-operational-checkbox">{CONSTANTS.isOperationalLabel}</label>
            </div>
            
            <div className="laundry-asset-registration-form__row">
                <div className='laundry-asset-registration-form__short-input-field margin-right-2'>
                    <GenFormInput
                        name='runningTime'
                        setStateFn={setRunningTime}
                        inputState={runningTime}
                        validationFn={validateRunningTime}
                        minWidth="120px"/>
                </div>
                <div className='section-text'>{CONSTANTS.insertTimeInMinutesLabel}</div>
            </div>
            <span className="gen-form-input__error-msg margin-bottom-2">
                {runningTime.isTouched && !runningTime.isValid && CONSTANTS.runningTimeValidationError}
            </span>

            <div className="laundry-asset-registration-form__row">
                <div className='laundry-asset-registration-form__short-input-field margin-right-2'>
                    <GenFormInput
                        name='servicePrice'
                        setStateFn={setServicePrice}
                        inputState={servicePrice}
                        validationFn={validateServicePrice}
                        minWidth="120px"
                    />
                </div>
                <CurrencyDropdown
                    currencies={CONSTANTS.supportedCurrencies}
                    selectedCurrency={currency}
                    setSelectedCurrency={setCurrency} />
            </div>
            <span className="gen-form-input__error-msg margin-bottom-2">
                {servicePrice.isTouched && !servicePrice.isValid && CONSTANTS.priceValidationError}
            </span>

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
