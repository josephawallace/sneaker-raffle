import './Footer.css'

import { Link } from '@mui/material'

const Footer = () => {
    return (
        <footer>
            <nav className='pages-links'>
                <Link variant='h6' underline='none' color='primary'>Help</Link>
            </nav>
        </footer>
    );
};

export default Footer;