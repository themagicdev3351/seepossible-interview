import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineEmail } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import toast from 'react-hot-toast';
import axios from 'axios';


const Signup = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateForm = (form) => {
        const errors = {};

        if (!form.firstName) {
            errors.firstName = 'First name is required';
        }
        if (!form.lastName) {
            errors.lastName = 'Last name is required';
        }
        if (!form.email) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(form.email)) {
            errors.email = 'Please enter a valid email address';
        }
        if (!form.password) {
            errors.password = 'Password is required';
        }

        return errors;
    };


    const handleSignup = async (e) => {
        e.preventDefault();
        const { firstName, lastName, email, password } = form;
        const errors = validateForm(form);

        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach(error => toast.error(error));
            return;
        }

        try {
            const response = await axios.post('/users', {
                name: `${firstName} ${lastName}`,
                email,
                password,
                gender: 'male',
                status: 'active',
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Signup successful:', response.data);
            toast.success('Signup successful!');
            navigate('/');
        } catch (err) {
            if (err.response && err.response.data) {
                toast.error(err.response.data[0].message);
            } else {
                toast.error('Error signing up, try again');
            }
        }
    };


    return (
        <section className='w-100'>
            <div className="container">
                <div className='row justify-content-center'>
                    <div className='col-sm-12 col-md-4'>
                        <h2>Sign Up</h2>
                        <p>Enjoy the great benefits and excllusive offers by creating your account</p>
                        <form onSubmit={handleSignup}>
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">First Name</label>
                                <input type="text" className="form-control" id="firstName" name="firstName" value={form.firstName} onChange={handleInputChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Last Name</label>
                                <input type="text" className="form-control" id="lastName" name="lastName" value={form.lastName} onChange={handleInputChange} />
                            </div>
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
                            <div class="form-group mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="gridCheck" />
                                    <label class="form-check-label" for="gridCheck">
                                        Check me out
                                    </label>
                                </div>
                                <p>By clicking sign Up, you agree to our <Link to={'/'}> Tern and Condition</Link> and <Link to={'/'}>Privacy Statement</Link></p>
                            </div>
                            <button type="submit" className="btn c_btn">Sign Up</button>
                            <p className='mt-3 text-center'>Already Have an Account? <Link to={'/'}> Sign IN</Link></p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signup;
