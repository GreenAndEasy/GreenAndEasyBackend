import React, {Component} from 'react';
import { connect } from 'react-redux';
import { getCurrentUser } from "./../../store/actions/currentUser";
import {NavLink} from 'react-router-dom';
import NewUserTippcard from './NewUserTippcard';

class Website extends Component {

    componentWillMount() {
        this.props.getCurrentUser();
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.newCurrentUser){
            this.props.currentUser.unshift(nextProps.newCurrentUser);
        }
    }

    render() {
        return (
            <div>
                <h1>Website</h1>
                {JSON.stringify(this.props.currentUser)}
                <br/>
                <NavLink to={'/login'}>Login</NavLink>
                <NewUserTippcard/>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    newCurrentUser: state.auth.newCurrentUser
});

export default connect(mapStateToProps, { getCurrentUser }) (Website);