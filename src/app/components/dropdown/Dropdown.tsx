import { useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { RiArrowDropDownLine, RiArrowDropUpLine } from 'react-icons/ri';
import CONSTANTS from '../../../assets/constants';
import './Dropdown.css';

const DEFAULT_VALUE = 'Select Machine';

interface DropdownProps {
    items: any[];
    currentlySelectedItem: number;
    setItemFn: Function;
}

export default function Dropdown(props: DropdownProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    function getSelectedValue() {
        if (props.currentlySelectedItem === CONSTANTS.defaultDropdownValue) {
            return DEFAULT_VALUE;
        } else return props.items[props.currentlySelectedItem].name;
    }

    function getDropdownArrow() {
        if (isDropdownOpen) return <RiArrowDropUpLine size={30} />
        else return <RiArrowDropDownLine size={30} />
    }

    function handleDropdownSelect(index: number) {
        props.setItemFn(index);
        setIsDropdownOpen(false);
    }

    return (
        <div className='dropdown'>
            <button 
                className='dropdown__label-container'
                type='button'
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >    
                <div className='dropdown__label'>
                    {getSelectedValue()}
                </div>
                <div
                    className='button-container'
                >{getDropdownArrow()}</div>
            </button>
            {<div className={`dropdown__menu ${isDropdownOpen ? 'open' : ''}`}>
                {props.items.map((asset, index) => {
                    return <>
                        <button
                            className='dropdown__menu-item margin-right-2'
                            key={`dropdown__menu-item-${index}`}
                            type='button'
                            onClick={() => handleDropdownSelect(index)}>
                            <div
                                className='dropdown__label'
                            >{asset.name}</div>
                            {props.currentlySelectedItem === index && <AiOutlineCheck size={20} />}
                        </button>
                        {index !== props.items.length - 1 && <hr className='dropdown__menu-item-delimiter'/>}
                    </>
                })}
            </div>}
        </div>
    );
}
