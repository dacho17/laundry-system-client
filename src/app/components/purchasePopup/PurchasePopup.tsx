import CtaButton from '../ctaButton/CtaButton';
import { IoCloseOutline } from 'react-icons/io5';
import User from '../../../dtos/User';
import './PurchasePopup.css';

interface PurchasePopupProps {
    user: User;
    title: string;
    content: string;
    assetId: number;
    pointBalanceContent?: string;
    priceInPoints: number;
    useCardButtonLabel: string;
    usePointsButtonLabel: string;
    closePopupFn: Function;
    actionFn: Function;
    errorMsg?: string;
    isLoading?: boolean;
    successMsg?: string;
}

export default function PurchasePopup(props: PurchasePopupProps) {

    return (
        <>
            <div className='overlay' onClick={() => props.closePopupFn()} />
                <div className='popup'>
                    <div className='popup__close-button-row'>
                        <div className='popup__close-button'
                            onClick={() => props.closePopupFn()}
                        ><IoCloseOutline size={30} /></div>
                    </div>
                    <div className='popup__title margin-bottom-1'>
                        {props.title}
                    </div>

                    {props.successMsg ? <div className='popup__success-msg margin-top-2'>
                        {props.successMsg}
                    </div>
                    
                    : <>
                        <div className='purchase-popup__content margin-bottom-2'>
                            {props.content}
                        </div>
                        <div className='popup__intaractive-section'>
                            <div className='purchase-popup__button-row margin-bottom-1'>
                                <div className='purchase-popup__button'>
                                    <CtaButton
                                        label={props.useCardButtonLabel}
                                        actionFn={() => props.actionFn(false)}
                                        isDisabled={props.isLoading ?? props.successMsg !== null ?? false}
                                    />                                    
                                </div>
                                { props.pointBalanceContent && <div className='purchase-popup__button'>
                                    <CtaButton
                                        label={props.usePointsButtonLabel}
                                        actionFn={() => props.actionFn(true)}
                                        isDisabled={props.isLoading ?? props.successMsg !== null ?? false}
                                    />
                                </div>}
                            </div>
                            {props.pointBalanceContent && <div className='section-text'>
                                {props.pointBalanceContent}
                            </div>}
                            {props.errorMsg && <div className='popup__error-msg margin-top-2'>
                                {props.errorMsg}
                            </div>}
                        </div>
                    </>}
                </div>
        </>
    );
}
