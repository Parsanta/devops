import React, { Component } from "react";
import axios from 'axios';

class List extends Component {
    state = {
        users: [],
        showModal: false,
        currentUser: null
    };

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers = async () => {
        try {
            const response = await axios.get('https://parsanta.pythonanywhere.com/list/');
            this.setState({ users: response.data });
        } catch (error) {
            console.error('There was an error fetching the users!', error);
        }
    };

    handleDelete = async (userId) => {
        try {
            await axios.delete(`https://parsanta.pythonanywhere.com/delete/${userId}/`);
            this.fetchUsers();
        } catch (error) {
            console.error('There was an error deleting the user!', error);
        }
    };

    handleEdit = (user) => {
        this.setState({ showModal: true, currentUser: user });
    };

    handleCloseModal = () => {
        this.setState({ showModal: false, currentUser: null });
    };

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            currentUser: { ...prevState.currentUser, [name]: value }
        }));
    };

    handleSave = async () => {
        const { currentUser } = this.state;
        try {
            await axios.put(`https://parsanta.pythonanywhere.com/update/${currentUser.id}/`, currentUser, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.fetchUsers();
            this.handleCloseModal();
        } catch (error) {
            console.error('There was an error updating the user!', error);
        }
    };

    render() {
        const { users, showModal, currentUser } = this.state;

        return (
            <div className = "users">
                {users.map(user => (
                    <div key={user.id} className="user">
                        <span>{user.full_name}</span>
                        <span>
                            <button className="edit" onClick={() => this.handleEdit(user)}>Edit</button>
                            <button className="delete" onClick={() => this.handleDelete(user.id)}>Delete</button>
                        </span>
                        {/* <span className="icons">
                            <i className="fas fa-edit edit" onClick={() => this.handleEdit(user)}></i>
                            <i className="fas fa-trash-alt delete" onClick={() => this.handleDelete(user.email)} ></i>
                        </span> */}
                    </div>
                ))}
            {showModal && currentUser && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={this.handleCloseModal}>&times;</span>
                        <h2>Edit User</h2>
                        <form>
                            <label>
                                Full Name:
                                <input type="text" name="full_name" value={currentUser.full_name} onChange={this.handleChange} />
                            </label>
                            <label>
                                Email:
                                <input type="email" name="email" value={currentUser.email} onChange={this.handleChange} />
                            </label>
                            <label>
                                Age:
                                <input type="number" name="age" value={currentUser.age} onChange={this.handleChange} />
                            </label>
                            <label>
                                Gender:
                                <select name="gender" value={currentUser.gender} onChange={this.handleChange}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </label>
                            <label>
                                    Address:
                                    <input type="text" name="address" value={currentUser.address} onChange={this.handleChange} />
                                </label>
                                <button type="button" onClick={this.handleSave}>Save</button>
                            </form>
                        </div>
                    </div>
                )}  
                </div>
            
        );
    }
}

export default List;