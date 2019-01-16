import React, { Component } from 'react';
import { connect } from 'react-redux';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Website from './components/website/Website';
import Login from './components/login/Login';
import Backend from './components/backend/Backend';
import * as firebase from 'firebase';
import {getCurrentUser} from "./store/actions/currentUser";
import './materialize/css/materialize.css';

const config = {
    apiKey: "AIzaSyD_2Ut2DIaVldIJGIBcAoYmH9D0HKxmoP8",
    authDomain: "greenandeasy-2d010.firebaseapp.com",
    databaseURL: "https://greenandeasy-2d010.firebaseio.com",
    projectId: "greenandeasy-2d010",
    storageBucket: "greenandeasy-2d010.appspot.com",
    messagingSenderId: "548071697484"
};

firebase.initializeApp(config);



class App extends Component {

    componentWillMount() {
        this.props.getCurrentUser();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.newCurrentUser){
            this.props.currentUser.unshift(nextProps.newCurrentUser);
        }
    }

    render () {
        if(this.props.currentUser){
            return (
                    <BrowserRouter>
                        <Switch>
                            <Route path={'/'} component={Website} exact/>
                            <Route path={'/login'} component={Backend}/>
                            <Route path={'/backend'} component={Backend}/>
                        </Switch>
                    </BrowserRouter>
            )
        } else {
            return (
                    <BrowserRouter>
                        <Switch>
                            <Route path={'/'} component={Website} exact/>
                            <Route path={'/login'} component={Login}/>
                            <Route path={'/backend'} component={Login}/>
                        </Switch>
                    </BrowserRouter>
            )
        }
    }
}



const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    newCurrentUser: state.auth.newCurrentUser
});

export default connect(mapStateToProps, { getCurrentUser, firebase}) (App);
