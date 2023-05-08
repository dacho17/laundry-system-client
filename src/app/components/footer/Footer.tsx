import CONSTANTS from '../../../assets/constants';
import './Footer.css';

export default function Footer() {

    return (
        <div id='footer'>
            <div className='footer__item'>
                {CONSTANTS.allRightsReservedLabel}
            </div>
        </div>
    );
}
