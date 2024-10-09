import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    // const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is authenticated based on localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.id) {
            setIsAuthenticated(user);
        } else {
            setIsAuthenticated({})
        }
    }, [navigate]);


    const handleLogout = () => {
        localStorage.removeItem('user');
        toast.success('LogOut successful');
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to='/' >Seepossible</Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto d-flex align-items-center">
                        {!isAuthenticated.id ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to='/' >Login</Link>
                                </li>
                                <span>|</span>
                                <li className="nav-item">
                                    <Link className="nav-link" to='/signup' >Sign Up</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link">welcome,
                                        <span className='text-decoration-underline ps-1'>
                                            {isAuthenticated.name}
                                        </span>
                                    </span>
                                </li>
                                <span>|</span>
                                <li className="nav-item">
                                    <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Header;
