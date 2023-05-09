import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import './CurrencyDropdown.css';
import { useState } from 'react';
import CONSTANTS from '../../../assets/constants';
import { AiOutlineCheck } from 'react-icons/ai';

interface CurrencyDropdownProps {
    currencies: string[];
    selectedCurrency: string;
    setSelectedCurrency: Function;
}

export default function CurrencyDropdown(props: CurrencyDropdownProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    function getDropdownArrow() {
        if (isDropdownOpen) return <RiArrowDropUpLine size={30} />
        else return <RiArrowDropDownLine size={30} />
    }

    function handleOnSelect(currency: string) {
        props.setSelectedCurrency((prevState: any) => {
            const isCurrencyValid = CONSTANTS.supportedCurrencies.includes(currency);

            return isCurrencyValid ? currency : props.selectedCurrency
        });
    }

    return (
        <div className='currency-dropdown'>
            <button 
                className='currency-dropdown__label-container'
                type='button'
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >    
                <div className='currency-dropdown__label'>
                    {props.selectedCurrency}
                </div>
                <div
                    className='button-container'
                >{getDropdownArrow()}</div>
            </button>
            {isDropdownOpen && <div className='currency-dropdown__menu'>
                {props.currencies.map((currency, index) => {
                    return <>
                        <button
                            className='currency-dropdown__menu-item margin-right-2'
                            key={`dropdown__menu-item-${index}`}
                            type='button'
                            onClick={() => handleOnSelect(currency)}>
                            <div
                                className='currency-dropdown__label'
                            >{currency}</div>
                            {props.selectedCurrency === currency && <AiOutlineCheck size={20} />}
                        </button>
                        {index !== props.currencies.length - 1 && <hr className='currency-dropdown__menu-item-delimiter'/>}
                    </>
                })}
            </div>}
        </div>
    );
}