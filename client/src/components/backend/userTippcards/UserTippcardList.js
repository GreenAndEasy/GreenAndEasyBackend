import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import * as firebase from 'firebase';
import { getTippcards } from "./../../../store/actions/tippcards";
import { getUserTippcards } from "../../../store/actions/userTippcards";
import { getCategories } from "./../../../store/actions/categories";
import { getInteractions } from "./../../../store/actions/interactions";
import EditUserTippcardModal from './EditUserTippcardModal';
import ViewUserTippcardModal from './ViewUserTippcardModal';

let allTippcardElements;
let userTippcards=[];
let categories=[];
let interactions=[];
let itemHasBeenDeleted = false;

class TippcardList extends Component {

    constructor(props){
        super(props);
        this.state = {
            reload: false,
            logoutEventFinished: false,
            activeBackendSection: 'userTippcards',
            deleteModalIsOpen: false,
            itemToInteract: '',
            reloadState: false
        };
        this.props.getTippcards();
        this.props.getUserTippcards();
        this.props.getCategories();
        this.props.getInteractions();

        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.afterOpenDeleteModal = this.afterOpenDeleteModal.bind(this);
        this.closeDeleteModal = this.closeDeleteModal.bind(this);
        this.verifyTippcard = this.verifyTippcard.bind(this);
    }

    openDeleteModal(deleteId,deleteCategories,deleteText,deleteInteractions) {
        this.setState({
            deleteModalIsOpen: true,
            itemToInteract: deleteId,
            categories: deleteCategories,
            text: deleteText,
            interactions: deleteInteractions
        });
    }

    afterOpenDeleteModal() {
        // references are now sync'd and can be accessed.
    }

    closeDeleteModal() {
        this.setState({deleteModalIsOpen: false});
    }

    verifyTippcard(e, item, allTippcards) {
        e.preventDefault();
        let tippcards = [];
        let jsonOfTippcards = this.props.tippcards;
        for(let i=0;i<Object.keys(jsonOfTippcards).length;i++) {
            tippcards[i] = jsonOfTippcards[i];
        }
        let jsonOfUserTippcards = this.props.userTippcards;
        for(let i=0;i<Object.keys(jsonOfUserTippcards).length;i++) {
            userTippcards[i] = jsonOfUserTippcards[i];
        }
        let arr1 = allTippcards.slice(0,item.id);
        let arr2 = allTippcards.slice(item.id+1,userTippcards.length);
        arr2.map((tippcard)=>{
            tippcard.id = tippcard.id-1;
        });
        allTippcards = arr1.concat(arr2);
        item.id = tippcards.length;
        firebase.database().ref('/tippcards/'+tippcards.length+'/').update(item).then(()=>{
            firebase.database().ref('/userTippcards/').remove();
                setTimeout(()=>{
                    firebase.database().ref('/userTippcards/').set(allTippcards).then(
                        setTimeout(()=>{
                            itemHasBeenDeleted=true;
                            this.props.getTippcards();
                            document.getElementById('hiddenSubmitter').click();
                        },1000))
                },2000)
            }
        );
    }

    deleteTippcard(itemToDelete,e, allTippcards) {
        e.preventDefault();
        let arr1 = allTippcards.slice(0,itemToDelete);
        let arr2 = allTippcards.slice(itemToDelete+1,allTippcardElements.length+1);
        arr2.map((tippcard)=>{
            if(tippcard!==0){
                tippcard.id = tippcard.id-1;
            }
        });
        allTippcards = arr1.concat(arr2);
        firebase.database().ref('/userTippcards/').remove();
        setTimeout(()=>{
            firebase.database().ref('/userTippcards/').set(allTippcards).then(this.closeDeleteModal).then(
                setTimeout(()=>{
                    itemHasBeenDeleted=true;
                    this.props.getTippcards();
                    document.getElementById('hiddenSubmitter').click();
                },1000))
        },2000)
    }

    render() {
        if(this.props.userTippcards){
            if(JSON.stringify(this.props.userTippcards) !== '[]'){
                if(!itemHasBeenDeleted){
                    let jsonOfTippcards = this.props.userTippcards;
                    for(let i=0;i<Object.keys(jsonOfTippcards).length;i++) {
                        userTippcards[i] = jsonOfTippcards[i];
                    }
                    itemHasBeenDeleted = false;
                } else {
                    let jsonOfTippcards = this.props.userTippcards;
                    for(let i=0;i<Object.keys(jsonOfTippcards).length-2;i++) {
                        userTippcards[i] = jsonOfTippcards[i];
                    }
                }
                allTippcardElements = userTippcards.map((tippcard)=> {
                    let interactionsElement = '';
                    categories = [];
                    let categoriesJSON = tippcard.category;
                    for(let i=0;i<Object.keys(categoriesJSON).length;i++) {
                        categories[i] = categoriesJSON[i].name;
                    }
                    let categoriesElement = categories.map((category)=>{
                        return <li key={category}><strong>{category}</strong></li>
                    });
                    if(tippcard.interaction){
                        interactions = [];
                        let interactionsJSON = tippcard.interaction;
                        for(let i=0;i<Object.keys(interactionsJSON).length;i++) {
                            interactions[i] = interactionsJSON[i];
                        }
                        interactionsElement = interactions.map((interaction)=>{
                            if(interaction.name==='Link'){
                                return <div className="col s3 interaction-element" key={interaction.name}><strong>{interaction.name}</strong><br/><a href={interaction.link} target="_blank">{interaction.linkText}</a></div>
                            } else {
                                return <div className="col s3 interaction-element" key={interaction.name}><strong>{interaction.name}</strong></div>
                            }
                        });
                    }
                    let kindStyle = 'collection-item-element';
                    let kindDescription = '';
                    if(tippcard.kind==='Anzeige'){
                        kindStyle = kindStyle.concat(' ');
                        kindStyle = kindStyle.concat('ad');
                        kindDescription = 'Anzeige';
                    }
                    if(tippcard.kind==='Usergenerated'){
                        kindStyle = kindStyle.concat(' ');
                        kindStyle = kindStyle.concat('usergenerated');
                        kindDescription = 'User';
                    }
                    if(tippcard.kind==='Intern'){
                        kindStyle = kindStyle.concat(' ');
                        kindStyle = kindStyle.concat('intern');
                        kindDescription = 'Intern';
                    }
                    return <li key={tippcard.id} className={kindStyle}>
                        <div className="kind-description">
                            {kindDescription}
                        </div>
                        <div className="row">
                            <div className="col s5">
                                <div className="row">
                                    <div className="col s1">
                                        <strong>{tippcard.id}</strong>
                                    </div>
                                    <div className="col s2">
                                        <ul>
                                            {categoriesElement}
                                        </ul>
                                    </div>
                                    <div className="col s8 offset-l1">
                                        {tippcard.text}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col s10 offset-l1" style={{marginTop: '15px'}}>
                                        {interactionsElement}
                                        <div className="col s3 interaction-element"><strong>Share</strong></div>
                                        <div className="col s3 interaction-element"><strong>Favourite</strong></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col s7" style={{textAlign: "right"}}>
                                <div className="row">
                                    <div className="col s3">
                                        <ViewUserTippcardModal tippcard={tippcard}/>
                                    </div>
                                    <div className="col s3">
                                        <EditUserTippcardModal tippcard={tippcard}/>
                                    </div>
                                    <div className="col s3">
                                        <button className={'waves-effect waves-light btn'} onClick={e => this.verifyTippcard(e,tippcard,userTippcards)}>
                                            Freigeben
                                        </button>
                                    </div>
                                    <div className="col s3">
                                        <button className={'waves-effect waves-light btn'} onClick={()=>{this.openDeleteModal(tippcard.id, categoriesElement, tippcard.text, interactionsElement)}}>
                                            Löschen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                });
            }
        } else {
            allTippcardElements = 'Unsere Besucher haben grade keine neuen Tippkarten hinzugefügt!';
        }
        return (
            <div>
                <Modal
                isOpen={this.state.deleteModalIsOpen}
                onAfterOpen={this.afterOpenDeleteModal}
                onRequestClose={this.closeDeleteModal}
                contentLabel="Example Modal"
                className="modal"
                ariaHideApp={false}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.25)'
                    }
                }}
            >
                <div className="row">
                    <h3>Tippkarte löschen</h3>
                    <p>Du bist im Begriff diese Tippkarte {this.state.itemToInteract} zu löschen. Willst du das wirklich tun?</p>
                    <div className="collection-item-element">
                        <ul className="collection">
                            <li key={this.state.itemToInteract} className="collection-item-element">
                                <div className="row">
                                    <div className="col s12">
                                        <div className="row">
                                            <div className="col s1">
                                                <strong>{this.state.itemToInteract}</strong>
                                            </div>
                                            <div className="col s2">
                                                <ul>
                                                    {this.state.categories}
                                                </ul>
                                            </div>
                                            <div className="col s8 offset-l1">
                                                {this.state.text}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col s10 offset-l1" style={{marginTop: '15px'}}>
                                                {this.state.interactions}
                                                <div className="col s3 interaction-element"><strong>Share</strong></div>
                                                <div className="col s3 interaction-element"><strong>Favourite</strong></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <form>
                        <div className="col s6" style={{marginTop: "20px"}}>
                            <button className={'waves-effect waves-light btn'} onClick={this.closeDeleteModal}>
                                Abbrechen
                            </button>
                        </div>

                        <div className="col s6" style={{textAlign: "right",marginTop: "20px"}}>
                            <button className={'waves-effect waves-light btn'}  onClick={e => this.deleteTippcard(this.state.itemToInteract,e,userTippcards)}>
                                Löschen
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
                <ul className="collection">
                   {allTippcardElements}
                </ul>
                <form>
                    <button id="hiddenSubmitter" className={'waves-effect waves-light btn'} style={{display:'none'}}>
                        Reload
                    </button>
                </form>
            </div>
        )
    }
}

TippcardList.propTypes = {
    getTippcards: PropTypes.func.isRequired,
    getUserTippcards: PropTypes.func.isRequired,
    getCategories: PropTypes.func.isRequired,
    getInteractions: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    tippcards: state.tippcards.tippcards,
    userTippcards: state.userTippcards.userTippcards,
    categories: state.categories.categories,
    interactions: state.interactions.interactions
});

export default connect(mapStateToProps, { getTippcards, getUserTippcards, getCategories, getInteractions }) (TippcardList);