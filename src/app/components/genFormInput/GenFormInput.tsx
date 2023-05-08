import { useRef } from 'react';
import './GenFormInput.css';
import FormInputState from '../../../interfaces/formInputState';


interface FormInput {
    name: string;
    validationFn?: Function;
    inputState: FormInputState;
    setStateFn: Function;
    errMsg?: string;
    disabled?: boolean;
    minWidth?: string;
}

function GenFormInput(props: FormInput) {
    const inputRef = useRef<HTMLInputElement>(null);

    function onInputChanged(event: { target: HTMLInputElement; }, didBlur: boolean) {
        props.setStateFn((prevState: FormInputState): FormInputState => {
            return {
                entered: event.target.value,
                isValid: props.validationFn ? props.validationFn(event.target.value) : true,
                isTouched: prevState.isTouched || didBlur
            }
        });
    }

    const smallerSizeStyle = props.minWidth ? {minWidth: props.minWidth, paddingBottom: 0} : {}
    const disabledClass = props.disabled ? 'disabled-background' : '';
    return (
        <div className="gen-form-input" style={smallerSizeStyle}>
            <div className={`gen-form-input__container ${disabledClass}`}>
                <input
                    className="gen-form-input__value"
                    disabled={props.disabled ?? false}
                    name={props.name}
                    value={props.inputState.entered}
                    ref={inputRef}
                    onChange={(event) => onInputChanged(event, false)}
                    onBlur={(event) => onInputChanged(event, true)} />
                <label 
                    className="gen-form-input__placeholder"
                    htmlFor={props.name}
                    onClick={() => inputRef.current!.focus()}
                    >
                        {props.name}</label>
            </div>
            {
                props.validationFn && !props.validationFn(props.inputState.entered) && props.inputState.isTouched &&
                    <span className="gen-form-input__error-msg">{props.errMsg}</span>
            }
        </div>
    );
}

export default GenFormInput;
