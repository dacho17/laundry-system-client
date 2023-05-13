import { useState } from 'react';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import './DialCodeFormInput.css';
import { AiOutlineCheck } from 'react-icons/ai';
import CountryDialCode from '../../../dtos/CountryDialCode';

interface DialCodeFormInput {
    countryDialCodes: CountryDialCode[];
    currentlySelectedDialCode: CountryDialCode;
    setSelectedDialCode: Function;
}

export default function DialCodeFormInput(props: DialCodeFormInput) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    function getDropdownArrow() {
        if (isDropdownOpen) return <RiArrowDropUpLine size={30} />
        else return <RiArrowDropDownLine size={30} />
    }

    function handleDropdownSelect(dialCode: CountryDialCode) {
        props.setSelectedDialCode(dialCode);
        setIsDropdownOpen(false);
    }

    console.log(`currently selected country is ${props.currentlySelectedDialCode.dialCode}`);
    return (
            <div className='mobile-number-dropdown'>
                <button 
                    className='mobile-number-dropdown__label-container'
                    type='button'
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >    
                    <div className='mobile-number-input__country-info'>
                        <div className='mobile-number-input__flag-container'>
                            {props.currentlySelectedDialCode.countryIcon}
                        </div>
                        <div className='mobile-number-dropdown__label'>
                            {props.currentlySelectedDialCode.dialCode}
                        </div>                    
                    </div>
                    <div
                        className='button-container'
                    >{getDropdownArrow()}</div>
                </button>
                {<div className={`mobile-number-dropdown__menu ${isDropdownOpen ? 'open' : ''}`}>
                    {props.countryDialCodes.map((countryDialCode, index) => {
                        return <>
                            <button
                                className='mobile-number-dropdown__menu-item'
                                key={`mobile-number-dropdown__menu-item-${index}`}
                                type='button'
                                onClick={() => handleDropdownSelect(countryDialCode)}>
                                    <div className='mobile-number-input__country-info'>
                                        <div className='mobile-number-input__flag-container'>
                                            {countryDialCode.countryIcon}
                                        </div>
                                        <div className='mobile-number-dropdown__label'>
                                            {countryDialCode.dialCode}
                                        </div>                    
                                    </div> 
                                {countryDialCode.dialCode === props.currentlySelectedDialCode.dialCode && <AiOutlineCheck size={20} />}
                            </button>
                            {index !== props.countryDialCodes.length - 1 && <hr className='mobile-number-dropdown__menu-item-delimiter'/>}
                        </>
                    })}
                </div>}
            </div>
    );
}
