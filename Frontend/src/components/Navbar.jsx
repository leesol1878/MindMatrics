import React, { useState, useEffect } from 'react'
import { navbarStyles } from '../assets/dummyStyles'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import myLogo from '../assets/quizlogo.png';
import { Award, LogIn, LogOut, X, Menu } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    
    // Check if user is logged in on component mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('user');
        setLoggedIn(!!token && !!user);
        
        // Listen for auth changes
        const handleAuthChange = () => {
            const token = localStorage.getItem('authToken');
            const user = localStorage.getItem('user');
            setLoggedIn(!!token && !!user);
        };
        
        window.addEventListener('authChange', handleAuthChange);
        return () => window.removeEventListener('authChange', handleAuthChange);
    }, []);

    // Logout function
    const handleLogout = () => {
        try {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        } catch(error) {
            // ignore all the error
        }

        window.dispatchEvent(new Event('authChange'));
        setLoggedIn(false);
        navigate('/');
    }

    return (
        <nav className={navbarStyles.nav}>
            {/* Decorative background elements */}
            <div 
                style={{ backgroundImage: navbarStyles.decorativePatternBackground }}
                className={navbarStyles.decorativePattern}
            ></div>
            <div className={navbarStyles.bubble1}></div>
            <div className={navbarStyles.bubble2}></div>
            <div className={navbarStyles.bubble3}></div>

            {/* Main container */}
            <div className={navbarStyles.container}>
                {/* Logo section */}
                <div className={navbarStyles.logoContainer}>
                    <Link to="/" className={navbarStyles.logoButton}>
                        <div className={navbarStyles.logoInner}>
                            <img
                                src={myLogo}
                                alt="MindMatrics logo"
                                className={navbarStyles.logoImage}
                            />
                        </div>
                    </Link>
                </div>

                {/* Title section */}
                <div className={navbarStyles.titleContainer}>
                    <div className={navbarStyles.titleBackground}>
                        <h1 className={navbarStyles.titleText}>MindMatrix Quiz Application</h1>
                    </div>
                </div>

                {/* Desktop buttons */}
                <div className={navbarStyles.desktopButtonsContainer}>
                    <div className={navbarStyles.spacer}>
                        <NavLink to='/results' className={navbarStyles.resultsButton}>
                            <Award className={navbarStyles.buttonIcon} />
                            My Results
                        </NavLink>
                        {loggedIn ? (
                            <button onClick={handleLogout} className={navbarStyles.logoutButton}>
                                <LogOut className={navbarStyles.buttonIcon} />
                                Logout
                            </button>
                        ) : (
                            <Link to='/login' className={navbarStyles.loginButton}>
                                <LogIn className={navbarStyles.buttonIcon} />
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={navbarStyles.mobileMenuContainer}>
                    <button 
                        onClick={() => setMenuOpen(!menuOpen)} 
                        className={navbarStyles.menuToggleButton}
                    >
                        {menuOpen ? <X className={navbarStyles.menuIcon} /> : <Menu className={navbarStyles.menuIcon} />}
                    </button>
                    
                    {menuOpen && (
                        <div className={navbarStyles.mobileMenuPanel}>
                            <ul className={navbarStyles.mobileMenuList}>
                                <li>
                                    <NavLink 
                                        to='/results' 
                                        className={navbarStyles.mobileMenuItem}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <Award className={navbarStyles.mobileMenuIcon} />
                                        My Results
                                    </NavLink>
                                </li>
                                {loggedIn ? (
                                    <li>
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                handleLogout();
                                                setMenuOpen(false);
                                            }} 
                                            className={navbarStyles.mobileMenuItem}
                                        >
                                            <LogOut className={navbarStyles.mobileMenuIcon}/>
                                            Logout
                                        </button>
                                    </li>
                                ) : (
                                    <li>
                                        <Link 
                                            to='/login' 
                                            className={navbarStyles.mobileMenuItem} 
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            <LogIn className={navbarStyles.mobileMenuIcon}/>
                                            Login
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            
        </nav>
    );
};

export default Navbar;