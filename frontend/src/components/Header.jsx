import './Header.css';

import { Link } from '@mui/material';

const Header = (props) => {
    return (
        <header>
            <Link variant='h6' underline='none' color='#fff'>Milquetoast</Link>
        </header>
    );
}

export default Header;