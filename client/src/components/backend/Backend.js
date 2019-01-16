import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import Modal from 'react-modal';
import { getCurrentUser } from "./../../store/actions/currentUser";
import {Redirect} from 'react-router-dom';

import Tippcards from './tippcards/Tippcards';
import Usercards from './userTippcards/UserTippcards';
import Users from './users/Users';

class Backend extends Component {

    constructor(props){
        super(props);
        this.state = {
            logoutEventFinished: false,
            activeBackendSection: 'tippcards',
            logoutModalIsOpen: false
        };

        this.openLogoutModal = this.openLogoutModal.bind(this);
        this.afterOpenLogoutModal = this.afterOpenLogoutModal.bind(this);
        this.closeLogoutModal = this.closeLogoutModal.bind(this);
    }

    openLogoutModal() {
        this.setState({logoutModalIsOpen: true});
    }

    afterOpenLogoutModal() {
        // references are now sync'd and can be accessed.
    }

    closeLogoutModal() {
        this.setState({logoutModalIsOpen: false});
    }

    componentWillMount() {
        this.props.getCurrentUser();

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.newCurrentUser){
            this.props.currentUser.unshift(nextProps.newCurrentUser);
        }
    }

    handleClick(item){
        this.setState({activeBackendSection: item});
    }

    render() {
        let activeBackendComponent;
        if(this.state.activeBackendSection === 'logout'){
            firebase.database().ref('currentBackendUsers/'+firebase.auth().currentUser.uid).remove();
            firebase.auth().signOut();
            this.setState({logoutEventFinished: true});
        }



        if(this.state.logoutEventFinished){
            return(<Redirect to={'/'}/>);
        } else {
            let tippcardItemClass = ["collection-item"];
            let usercardItemClass = ["collection-item"]
            let usersItemClass = ["collection-item"];
            if(this.state.activeBackendSection === 'tippcards'){
                tippcardItemClass.push('active');
                activeBackendComponent = <Tippcards/>;
            } else {
                tippcardItemClass = ["collection-item"];
            }
            if(this.state.activeBackendSection === 'userTippcards'){
                usercardItemClass.push('active');
                activeBackendComponent = <Usercards/>;
            } else {
                usercardItemClass = ["collection-item"];
            }
            if(this.state.activeBackendSection === 'users'){
                usersItemClass.push('active');
                activeBackendComponent = <Users/>;
            } else {
                usersItemClass = ["collection-item"];
            }
            return (
                <div>
                    <Modal
                        isOpen={this.state.logoutModalIsOpen}
                        onAfterOpen={this.afterOpenLogoutModal}
                        onRequestClose={this.closeLogoutModal}
                        contentLabel="Example Modal"
                        className="modal-small"
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.25)'
                            }
                        }}
                    >
                        <form>
                            <div className="row">
                                <h3>Logout</h3>
                                <p>Du bist im Begriff das Backend zu verlassen. Logst du dich aus musst du dich neu anmelden.</p>
                                <div className="col s6" style={{marginTop: "20px"}}>
                                    <button className={'waves-effect waves-light btn'} onClick={this.closeLogoutModal}>
                                        Abbrechen
                                    </button>
                                </div>
                                <div className="col s6" style={{textAlign: "right",marginTop: "20px"}}>
                                    <button className={'waves-effect waves-light btn'}  onClick={e => this.handleClick('logout')}>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Modal>
                    <div className='row'>
                        <div className='col s2'>
                            <div className="collection">
                                <a id="TippcardNav" name={'tippcards'} className={tippcardItemClass.join(' ')} onClick={e => this.handleClick('tippcards')}>Tippkarten</a>
                                <a id="UserTippcardsNav" name={'userTippcards'} className={usercardItemClass.join(' ')} onClick={e => this.handleClick('userTippcards')}>Karten von Usern</a>
                                <a id="UsersNav" name={'users'} className={usersItemClass.join(' ')} onClick={e => this.handleClick('users')}>Benutzer</a>
                                <a id="LogoutNav" name={'logout'} className="collection-item"  onClick={this.openLogoutModal}>Logout</a>
                            </div>
                        </div>
                        <div className='col s10' style={{backgroundColor: '#d0d0d0'}}>
                            <div className="main-backend-container">
                                {activeBackendComponent}
                            </div>
                        </div>
                    </div>
                </div>

            )
        }
    }
}

Backend.propTypes = {
    getCurrentUser: PropTypes.func.isRequired,
    newCurrentUser: PropTypes.object
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    newCurrentUser: state.auth.newCurrentUser
});

export default connect(mapStateToProps, { getCurrentUser }) (Backend);
