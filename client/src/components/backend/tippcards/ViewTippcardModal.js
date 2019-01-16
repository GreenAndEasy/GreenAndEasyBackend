import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import * as firebase from 'firebase';
import { getTippcards } from "./../../../store/actions/tippcards";
import { getCategories } from "./../../../store/actions/categories";
import { getInteractions } from "./../../../store/actions/interactions";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

let allCategoryChecks;
let categories=[];
let allInteractionChecks;
let interactions=[];

let newTippcardText = '';
let newTippcardLinkText = '';
let newTippcardLinkURL = '';
let newTippcardCategories = [];
let newTippcardInteractions = [];
let newTippcardId = null;

class ViewTippcardModal extends Component {

    constructor(props){
        super(props);

        this.state={
            newTippcardModalIsOpen: false,
            Map: false,
            Link: false
        };

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.props.getTippcards();
        this.props.getCategories();
        this.props.getInteractions();
    }

    openModal() {
        this.setState({newTippcardModalIsOpen: true});
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    closeModal() {
        this.setState({newTippcardModalIsOpen: false});
        this.setState({Map: false});
        this.setState({Link: false});
        newTippcardText = '';
        newTippcardLinkText = '';
        newTippcardLinkURL = '';
        newTippcardCategories = [];
        newTippcardInteractions = [];
        newTippcardId = null;
    }

    render() {

        return (
            <div>
                <Modal
                    isOpen={this.state.newTippcardModalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    contentLabel="Example Modal"
                    className="modal-large"
                    ariaHideApp={false}
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.25)'
                        }
                    }}
                >
                    <form id="newTippcardForm">
                        <div className="row">
                            <h3>Tippkarte {this.props.tippcard.id}</h3>

                        </div>
                        <div className="row" style={{textAlign: 'right', marginTop: '20px'}}>
                            <button ref="submit" className={'waves-effect waves-light btn'} onClick={this.closeModal}>
                                Zurück
                            </button>
                        </div>
                    </form>
                </Modal>
                <div>
                    <button className={'waves-effect waves-light btn'} onClick={this.openModal}>
                        Ansehen
                    </button>
                </div>
            </div>
        )
    }
}

ViewTippcardModal.propTypes = {
    getTippcards: PropTypes.func.isRequired,
    getCategories: PropTypes.func.isRequired,
    getInteractions: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    tippcards: state.tippcards.tippcards,
    categories: state.categories.categories,
    interactions: state.interactions.interactions
});

export default
//GoogleApiWrapper({
 //   apiKey: ('AIzaSyCTs9gGQf9QKKmFQbksPxguxYHvHhlM3qU')
//})(
    connect(mapStateToProps, { getTippcards, getInteractions, getCategories })(ViewTippcardModal)
//);
