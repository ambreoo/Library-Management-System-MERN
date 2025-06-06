import { React, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import './Header.css'

import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';
import { AuthContext } from '../Context/AuthContext';
import { useTranslation } from 'react-i18next';

function Header() {
    // const API_URL = "http://localhost:3001/";
    const API_URL = process.env.REACT_APP_API_URL
    const [menutoggle, setMenutoggle] = useState(false)
    const [memberDetails, setMemberDetails] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const { user } = useContext(AuthContext);
    const { t } = useTranslation();

    const Toggle = () => {
        setMenutoggle(!menutoggle)
    }

    const handleToggle = () => {
        const newLanguage = isChecked ? "en" : "zh";
        changeLanguage(newLanguage);
        setIsChecked(!isChecked);
    };

    const closeMenu = () => {
        setMenutoggle(false)
    }

    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng); // Dynamically switch languages
    };

    useEffect(() => {
        // Fetch member details only if the user is logged in
        const getMemberDetails = async () => {
            if (user && user._id) {
                try {
                    const response = await axios.get(
                        `${API_URL}api/users/getuser/${user._id}`
                    );
                    setMemberDetails(response.data);
                } catch (err) {
                    console.log("Error in fetching the member details:", err);
                }
            } else {
                // Reset member details when user logs out
                setMemberDetails(null);
            }
        };

        getMemberDetails();
    }, [API_URL, user]);

    return (
        <div className="header">
            <div className="logo-nav">
            <Link to='/'>
                {/* <a href="#home">{t('header.title')}</a> */}
                <div className="logo_wrapper">
                    <img className="logo_img" src="/school_logo.png" alt="CUSV logo" />
                </div>
            </Link>
            </div>
            <div className='nav-right'>
                {/* <input className="search-input" type="text" placeholder="Search a Book" /> */}
                <ul className={menutoggle ? "nav-options active" : "nav-options"}>
                    <li className="option" onClick={() => { closeMenu() }}>
                        <Link to='/'>
                            <a href="#home">{t('header.home')}</a>
                        </Link>
                    </li>
                    <li className="option" onClick={() => { closeMenu() }}>
                        <Link to='/books'>
                            <a href="#books">{t('header.books')}</a>
                        </Link>
                    </li>
                    <li className="option" onClick={closeMenu}>
                        {memberDetails ? (
                            // Make the user ID clickable
                            <Link to="/signin">
                                {memberDetails.employeeId || memberDetails.admissionId}
                            </Link>
                        ) : (
                            // Default to "Sign In" if no user is logged in
                            <Link to="/signin">{t('header.signin')}</Link>
                        )}
                    </li>
                    {/* <li className="option">
                        <select onChange={(e) => changeLanguage(e.target.value)} className="language-select">
                            <option value="en">English</option>
                            <option value="zh">中文</option>
                        </select>
                    </li> */}
                    <li class="switch">
                        <input class="toggle" type="checkbox" id="check" checked={isChecked} onChange={handleToggle}></input>
                        <label for="check" class="language-select">
                            <span class="zh">中</span>
                            <span class="en">EN</span>
                        </label>
                    </li>
                </ul>
            </div>

            <div className="mobile-menu" onClick={() => { Toggle() }}>
                {menutoggle ? (
                    <ClearIcon className="menu-icon" style={{ fontSize: 40 }} />
                ) : (
                    <MenuIcon className="menu-icon" style={{ fontSize: 40 }} />
                )}
            </div>
        </div>
    )
}

export default Header
