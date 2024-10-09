import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAuthenticated = user && Object.keys(user).length > 0;
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};



export default PrivateRoute;
