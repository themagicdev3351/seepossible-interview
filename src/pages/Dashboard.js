import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';

function Dashboard() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', gender: 'male', status: 'active' });
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const modalRef = useRef();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);


    useEffect(() => {
        fetchUsers();
    }, []);


    const fetchUsers = async () => {
        const response = await axios.get('/users', {
            headers: { Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}` },
        });
        setUsers(response.data);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers =
        searchTerm.length > 1
            ? users.filter((user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : users;


    const handleModalClose = () => {
        setShowModal(false);
        setNewUser({ name: '', email: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleModalOpen = async (id) => {
        if (id) {
            const response = await axios.get(`/users/${id}`, {
                headers: { Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}` },
            });
            const user = response.data;
            setNewUser(user);
            setIsEditing(true);
        } else {
            setIsEditing(false);
            setNewUser({ name: '', email: '', gender: 'male', status: 'active' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                const response = await axios.put(`/users/${newUser.id}`, newUser, {
                    headers: { Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}` },
                });
                setUsers(users.map(user => (user.id === newUser.id ? response.data : user)));
                toast.success('Edit User successful');
            } else {
                const response = await axios.post('/users', newUser, {
                    headers: { Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}` },
                });
                setUsers([...users, response.data]);
                toast.success('Created New User');
            }
            await fetchUsers();
            await handleModalClose();
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data[0].message);
            } else {
                toast.error('Error signing up, try again');
            }
        }
    };


    const handleDelete = async (id) => {
        setUserIdToDelete(id);
        setShowDeleteModal(true);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setUserIdToDelete(null)
    };

    const confirmDelete = async () => {
        await axios.delete(`/users/${userIdToDelete}`, {
            headers: { Authorization: `Bearer ${process.env.REACT_APP_GOREST_TOKEN}` },
        });
        setUsers(users.filter((user) => user.id !== userIdToDelete));
        toast.success('Delete User successful');
        setShowDeleteModal(false);
        setUserIdToDelete(null)
    };


    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Gender',
            selector: row => row.gender,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <button className="btn btn-info me-1" title='post' onClick={() => navigate(`/posts/${row.id}`)}>
                        <FaEye />
                    </button>
                    <button className="btn btn-warning me-1" onClick={() => handleModalOpen(row.id)}>
                        <FaEdit />
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(row.id)}>
                        <FaTrash />
                    </button>
                </>
            ),
        },
    ];


    return (
        <section className='dashboard_sec'>
            <div className="container">
                <h2>Dashboard</h2>
                <div className='row justify-content-between mt-4'>
                    <div className='col-auto'>
                        <button className="btn btn-light mb-3" onClick={() => handleModalOpen()}>
                            New User
                        </button>
                    </div>
                    <div className='col-auto'>
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="form-control mb-3"
                            onChange={handleSearch}
                        />
                    </div>
                </div>
                <div className='table-div'>
                    <DataTable
                        columns={columns}
                        data={filteredUsers}
                        pagination
                        highlightOnHover
                        pointerOnHover
                        striped
                        responsive
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 10, 20]}
                    />
                </div>

                <Modal centered show={showModal} onHide={handleModalClose} ref={modalRef} backdrop="false">
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditing ? 'Edit User Information' : 'Add New User'}</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Row className="mb-3">
                                <Col md={6}> {/* Set to take 50% of width on medium screens and up */}
                                    <Form.Group controlId="formUserName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter name"
                                            name="name"
                                            value={newUser.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}> {/* Set to take 50% of width on medium screens and up */}
                                    <Form.Group controlId="formUserEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            name="email"
                                            value={newUser.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group controlId="formUserGender" className="mb-3">
                                <Form.Label>Gender</Form.Label>
                                <Form.Select
                                    name="gender"
                                    value={newUser.gender}
                                    onChange={handleInputChange}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="formUserStatus" className="mb-3">
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={newUser.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Form.Select>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className='flex-nowrap border-0 pt-0'>
                            <Button className='c_btn' type="submit">
                                {isEditing ? 'Update User' : 'Create User'}
                            </Button>
                            <Button variant="light" className='w-100' onClick={handleModalClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                <Modal centered show={showDeleteModal} onHide={cancelDelete}>
                    <Modal.Body className='text-center'>Are you sure you want to delete this user?</Modal.Body>
                    <Modal.Footer className='flex-nowrap border-0 pt-0'>
                        <Button className='c_btn' onClick={confirmDelete}>
                            Delete
                        </Button>
                        <Button variant="light w-100" onClick={cancelDelete}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </section>
    );
}

export default Dashboard;
