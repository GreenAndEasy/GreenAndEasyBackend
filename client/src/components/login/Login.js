import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import {Redirect} from 'react-router-dom';
import { setCurrentUser, getCurrentUser } from "./../../store/actions/currentUser";

class Login extends Component {

    constructor(props){
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            email: '',
            password: '',
            error: ''
        };
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit (e) {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then(()=>{
            let user = firebase.auth().currentUser;
            let backendUsers = [];
            let backendUsersRef = firebase.database().ref("users");
            backendUsersRef.orderByChild("isAllowedForBackend").equalTo(true).once('value', (snap) => {
                snap.forEach((child)=> {
                    backendUsers.push({
                        id: child.val().id,
                        name: child.val().name,
                        isAllowedForBackend: child.val().isAllowedForBackend
                    });
                });
            }).then(()=>{
                backendUsers.map((backendUser)=>{
                    if(user.uid === backendUser.id){
                        firebase.database().ref('currentBackendUsers/' + backendUser.id).set({
                            id: backendUser.id,
                            name: backendUser.name,
                            isAllowedForBackend: backendUser.isAllowedForBackend
                        }).then(this.props.getCurrentUser);
                    } else {
                        this.setState({error: 'Mit diesem Account kannst du nicht auf die Inhalte hier zugreifen!'});
                    }
                    return true;

                });
            })
        }).catch(()=>{
            this.setState({error: 'Deine Logindaten sind nicht korrekt!'});
        });
    }


    componentWillMount() {
        this.props.getCurrentUser();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.newCurrentUser){
            this.props.currentUser.unshift(nextProps.newCurrentUser);
        }
    }

    render() {
        if(this.props.currentUser) {
            return (
                <Redirect to={'/backend'}/>
            );
        } else {
            return (
                <div className={'row'}>
                    <div className={'col s6 offset-s3'}>
                        <h1>Login</h1>
                        <form onSubmit={this.onSubmit}>
                            <div>
                                <label>Email:</label><br/>
                                <input type="text" name="email" value={this.state.email} onChange={this.onChange}/>
                            </div>
                            <br/>
                            <div>
                                <label>Passwort:</label><br/>
                                <input type="password" name="password" value={this.state.password} onChange={this.onChange}/>
                            </div>
                            <br/>
                            <button className={'waves-effect waves-light btn'} type="submit">
                                Login
                            </button>
                            <p>{this.state.error}</p>
                        </form>
                    </div>
                </div>
            )
        }
    }
}


Login.propTypes = {
    setCurrentUser: PropTypes.func.isRequired,
    getCurrentUser: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    newCurrentUser: PropTypes.object
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    newCurrentUser: state.auth.newCurrentUser
});


export default connect(mapStateToProps, {setCurrentUser, getCurrentUser})(Login);