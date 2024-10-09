import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-light py-4">
            <div className="container">
                <div className="row justify-content-between">
                    <div className="col-md-4">
                        <p className="mb-0">Cookie Policy - Legal Notice</p>
                    </div>
                    <div className="col-md-4">

                        <p className="mb-0">
                            Copyright © 2024. Made with <span style={{ color: 'red' }}>❤</span> from seepossible
                        </p>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex justify-content-end">
                            <a href="/" className="text-dark mx-2">
                                <FaFacebookF />
                            </a>
                            <a href="/" className="text-dark mx-2">
                                <FaInstagram />
                            </a>
                            <a href="/" className="text-dark mx-2">
                                <FaTwitter />
                            </a>
                            <a href="/" className="text-dark mx-2">
                                <FaPinterest />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
