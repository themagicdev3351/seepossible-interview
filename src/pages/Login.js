import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineEmail } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        let hasError = false;

        if (!form.email) {
            toast.error('Email is required');
            hasError = true;
        } else if (!isValidEmail(form.email)) {
            toast.error('Please enter a valid email address');
            hasError = true;
        }

        if (!form.password) {
            toast.error('Password is required');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        try {
            // Make API request to login (assume auth endpoint)
            const response = await axios.get(`/users`, {
                params: {
                    email: form.email,
                    password: form.password
                },
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}`,
                    'Content-Type': 'application/json',
                }
            });

            const res = response.data;

            if (res.length > 0) {
                localStorage.setItem('user', JSON.stringify(res[0]));
                toast.success('SignIn successful');
                navigate('/dashboard');
            } else {
                toast.error('Data not found');
            }

        } catch (error) {
            toast.error('Invalid credentials');
        }
    };

    return (
        <section className='w-100'>
            <div className="container">
                <div className='row justify-content-center'>
                    <div className='col-sm-12 col-md-4'>
                        <h2>Sign In</h2>
                        <p>Please enter the below details to sign in to your account</p>
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <div className="input-group">
                                    <input
                                        type="email"
                                        className="form-control"
                                        aria-describedby="email-icon"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleInputChange}
                                    />
                                    <span className="input-group-text" id="email-icon" >
                                        <MdOutlineEmail />
                                    </span>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="input-group">
                                    <input type={isPasswordVisible ? "text" : "password"}
                                        className="form-control" id="password" name="password" value={form.password} onChange={handleInputChange} />
                                    <span className="input-group-text" id="email-icon" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                                        {isPasswordVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                                    </span>
                                </div>
                            </div>
                            <button type="submit" className="btn c_btn">Login</button>
                            <p className='mt-3 text-center'>Don'y have account? <Link to={'/signup'}> Sign Up</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
