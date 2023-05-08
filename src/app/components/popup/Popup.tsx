import CtaButton from '../ctaButton/CtaButton';
import { IoCloseOutline } from 'react-icons/io5';
import './Popup.css';

interface PopupProps {
    title: string;
    content: string;
    buttonLabel: string;
    closePopupFn: Function;
    actionFn?: Function;
    errorMsg?: string;
    isLoading?: boolean;
    successMsg?: string; 
}

export default function Popup(props: PopupProps) {
    
    return (
        <>
            <div className='overlay' onClick={() => props.closePopupFn()} />
                <div className='popup'>
                    <div className='popup__close-button-row'>
                        <div className='popup__close-button'
                            onClick={() => props.closePopupFn()}
                        ><IoCloseOutline size={30} /></div>
                    </div>
                    <div className='popup__title'>
                        {props.title}
                    </div>

                    {props.successMsg ? <div className='popup__success-msg margin-top-2'>
                        {props.successMsg}
                    </div>
                    
                    : <>
                        <div className='popup__content'>
                            {props.content}
                        </div>
                        <div className='popup__intaractive-section'>
                            {props.actionFn && <>
                                <CtaButton
                                    label={props.buttonLabel}
                                    actionFn={props.actionFn}
                                    isDisabled={props.isLoading ?? props.successMsg !== null ?? false}
                                />
                                {props.errorMsg && <div className='popup__error-msg margin-top-2'>
                                    {props.errorMsg}
                                </div>}
                            </>}
                        </div>
                    </>}
                </div>
        </>
    );
}
