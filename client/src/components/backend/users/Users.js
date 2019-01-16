import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUsers } from "./../../../store/actions/users";

class Users extends Component {

    constructor(props){
        super(props);
        this.state = {
            logoutEventFinished: false,
            activeBackendSection: 'tippcards'
        };
        this.props.getUsers();
    }

    render() {
        return (
            <div>
                <h4>Benutzer</h4>
                {JSON.stringify(this.props.users)}
            </div>
        )
    }
}

Users.propTypes = {
    getUsers: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    users: state.users.users
});

export default connect(mapStateToProps, { getUsers }) (Users);