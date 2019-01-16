import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NewTippcardModal from '../tippcards/NewTippcardModal';
import UserTippcardList from './UserTippcardList';
import { getTippcards } from "../../../store/actions/tippcards";


class UserTippcards extends Component {

    constructor(props) {
        super(props)

        // Bind the this context to the handler function
        this.rerender = this.rerender.bind(this);
        this.deleteEl = this.deleteEl.bind(this);

        // Set some state
        this.state = {
            reloadState: false,
            reloadDeleteState: false
        };
    }

    rerender() {
        this.setState({
            reloadState: !this.state.reloadState
        });
    }

    deleteEl() {
        this.setState({
            reloadDeleteState: !this.state.reloadDeleteState
        });
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col s6">
                        <h4>Von Nutzern erstellte Tippkarten</h4>
                    </div>
                </div>
                <UserTippcardList/>
            </div>
        )
    }
}

UserTippcards.propTypes = {
    getTippcards: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    tippcards: state.tippcards.tippcards,
});

export default connect(mapStateToProps, { getTippcards }) (UserTippcards);