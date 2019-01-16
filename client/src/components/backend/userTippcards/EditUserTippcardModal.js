import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import * as firebase from 'firebase';
import { getTippcards } from "./../../../store/actions/tippcards";
import { getUserTippcards } from "./../../../store/actions/userTippcards";
import { getCategories } from "./../../../store/actions/categories";
import { getInteractions } from "./../../../store/actions/interactions";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

let allCategoryChecks;
let categories=[];
let allInteractionChecks;
let interactions=[];
let categoriesOfActiveCard = [];
let interactionsOfActiveCard = [];

let newTippcardText = '';
let newTippcardLinkText = '';
let newTippcardLinkURL = '';
let newTippcardCategories = [];
let newTippcardInteractions = [];
let newTippcardId = null;
let newTippcardKind = 'Usergenerated';

class EditTippcardModal extends Component {

    constructor(props){
        super(props);

        this.state={
            newTippcardModalIsOpen: false,
            Map: false,
            Link: false,
            state: false
        };

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.props.getTippcards();
        this.props.getUserTippcards();
        this.props.getCategories();
        this.props.getInteractions();
    }

    openModal() {
        this.setState({newTippcardModalIsOpen: true});

        let jsonOfChoosenCategories = this.props.tippcard.category;
        for(let i=0;i<Object.keys(jsonOfChoosenCategories).length;i++) {
            categoriesOfActiveCard[i] = jsonOfChoosenCategories[i].name;
        }
        newTippcardCategories = categoriesOfActiveCard;
        let jsonOfChoosenInteractions=null;
        if(this.props.tippcard.interaction){
            jsonOfChoosenInteractions = this.props.tippcard.interaction;
            for(let i=0;i<Object.keys(jsonOfChoosenInteractions).length;i++) {
                interactionsOfActiveCard[i] = jsonOfChoosenInteractions[i].name;
            }
            newTippcardInteractions = interactionsOfActiveCard;
        }
        setTimeout(()=>{
            document.getElementById('textarea').value = this.props.tippcard.text;
            for(let i=0;i<categoriesOfActiveCard.length;i++){
                let checkbox = document.getElementById(categoriesOfActiveCard[i]);
                checkbox.checked = true;
            }
            if(this.props.tippcard.interaction){
                for(let i=0;i<interactionsOfActiveCard.length;i++) {
                    let checkbox = document.getElementById(interactionsOfActiveCard[i]);
                    checkbox.checked = true;
                }
                for(let i=0; i<newTippcardInteractions.length;i++){
                    if(newTippcardInteractions[i]==='Map'){
                        this.setState({Map: true})
                    } else if(newTippcardInteractions[i]==='Link'){
                        this.setState({Link: true});
                        document.getElementById('LinkText').value = jsonOfChoosenInteractions[i].linkText;
                        document.getElementById('LinkURL').value = jsonOfChoosenInteractions[i].link;
                    }
                }
            }
      },500);
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
        categoriesOfActiveCard = [];
        interactionsOfActiveCard = [];
    }

    toggleCategoryCheckboxValue(name){
        let addCategory = true;
        let elementToDelete = null;
        for(let i=0; i<=newTippcardCategories.length;i++){
            if(name === newTippcardCategories[i]){
                addCategory = false;
                elementToDelete=i;
            }
        }
        if(addCategory){
            newTippcardCategories.push(name);
        } else {
            let arr1 = newTippcardCategories.slice(0,elementToDelete);
            let arr2 = newTippcardCategories.slice(elementToDelete+1,newTippcardCategories.length+1);
            newTippcardCategories = arr1.concat(arr2);
        }
        this.validateForm();
    }

    toggleInteractionCheckboxValue(name){
        let addInteraction = true;
        let elementToDelete = null;
        for(let i=0; i<=newTippcardInteractions.length;i++){
            if(name === newTippcardInteractions[i]){
                addInteraction = false;
                elementToDelete=i;
            }
        }
        if(addInteraction){
            newTippcardInteractions.push(name);
        } else {
            this.setState({[newTippcardInteractions[elementToDelete]]: false});
            let arr1 = newTippcardInteractions.slice(0,elementToDelete);
            let arr2 = newTippcardInteractions.slice(elementToDelete+1,newTippcardInteractions.length+1);
            newTippcardInteractions = arr1.concat(arr2);
        }
        for(let i=0; i<newTippcardInteractions.length;i++){
            if(newTippcardInteractions[i]==='Map'){
                this.setState({Map: true})
            } else if(newTippcardInteractions[i]==='Link'){
                this.setState({Link: true})
            }
        }
        this.validateForm();
    }

    setText(e){
        newTippcardText = e.target.value;
        this.validateForm();
    }

    setLinkText(e){
        newTippcardLinkText = e.target.value;
        this.validateForm();
    }

    setLinkURL(e){
        newTippcardLinkURL = e.target.value;
        this.validateForm();
    }

    validateForm(){
        this.refs.submit.setAttribute("disabled", "disabled");
        newTippcardText = document.getElementById('textarea').value;
        newTippcardLinkText = document.getElementById('LinkText').value;
        newTippcardLinkURL = document.getElementById('LinkURL').value;
        if(newTippcardText !== '' && newTippcardCategories.length>0){
            if(newTippcardInteractions.length>0){
                let allInteractions = [];
                let linkIsChoosen=false;
                let mapIsChoosen=false;
                let linkIsValid=false;
                let mapIsValid=false;
                for(let i=0; i<newTippcardInteractions.length; i++) {
                    allInteractions[i] = newTippcardInteractions[i]
                }
                for(let i=0; i<allInteractions.length; i++) {
                    if (allInteractions[i] === 'Link') {
                        linkIsChoosen = true;
                        if (document.getElementById('LinkText').value !== '' && this.isURL(document.getElementById('LinkURL').value)) {
                            linkIsValid=true;
                        }
                    }
                    if(allInteractions[i] === 'Map') {
                        mapIsChoosen=true;
                        mapIsValid=true;
                    }
                }
                if(linkIsChoosen){
                    if(linkIsValid){
                        linkIsValid = true;
                    } else {
                        linkIsValid = false
                    }
                } else {
                    linkIsValid = true;
                }
                if(mapIsChoosen){
                    mapIsValid = true;
                    if(mapIsValid){
                        mapIsValid = true;
                    } else {
                        mapIsValid = false
                    }
                } else {
                    mapIsValid = true
                }
                if(linkIsValid && mapIsValid){
                    this.refs.submit.removeAttribute("disabled", "disabled");
                }
            } else {
                this.refs.submit.removeAttribute("disabled", "disabled");
            }
        }
    }

    isURL(str) {
        let regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        if(!regex .test(str)) {
            return false;
        } else {
            return true;
        }
    }

    handleSubmit (e) {
        e.preventDefault();
        this.refs.submit.setAttribute("disabled", "disabled");
        let newTippcardCategoriesString='';
        newTippcardText = document.getElementById('textarea').value;
        newTippcardCategoriesString=newTippcardCategoriesString+'{';
        for(let i=0;i<newTippcardCategories.length;i++){
            if(i<newTippcardCategories.length-1){
                newTippcardCategoriesString=newTippcardCategoriesString+'"'+i+'":{"name":"'+newTippcardCategories[i]+'"},'
            } else {
                newTippcardCategoriesString=newTippcardCategoriesString+'"'+i+'":{"name":"'+newTippcardCategories[i]+'"}'
            }
        }
        newTippcardCategoriesString=newTippcardCategoriesString+'}';
        newTippcardCategories = JSON.parse(newTippcardCategoriesString);

        let newTippcardInteractionsString='';
        newTippcardInteractions.sort();
        newTippcardInteractionsString=newTippcardInteractionsString+'{';
        for(let i=0;i<newTippcardInteractions.length;i++){
            if(i<newTippcardInteractions.length-1){
                if(newTippcardInteractions[i]==='Link'){
                    newTippcardInteractionsString=newTippcardInteractionsString+'"'+i+'":{"name":"'+newTippcardInteractions[i]+'","link":"'+newTippcardLinkURL+'","linkText":"'+newTippcardLinkText+'"},'
                } else {
                    newTippcardInteractionsString=newTippcardInteractionsString+'"'+i+'":{"name":"'+newTippcardInteractions[i]+'"},'
                }
            } else {
                if(newTippcardInteractions[i]==='Link'){
                    newTippcardInteractionsString=newTippcardInteractionsString+'"'+i+'":{"name":"'+newTippcardInteractions[i]+'","link":"'+newTippcardLinkURL+'","linkText":"'+newTippcardLinkText+'"}'
                } else {
                    newTippcardInteractionsString=newTippcardInteractionsString+'"'+i+'":{"name":"'+newTippcardInteractions[i]+'"}'
                }
            }
        }
        newTippcardInteractionsString=newTippcardInteractionsString+'}';
        newTippcardInteractions = JSON.parse(newTippcardInteractionsString);
        newTippcardId = this.props.tippcard.id;
        let newTippcard = {
            text: newTippcardText,
            id: newTippcardId,
            category: newTippcardCategories,
            interaction: newTippcardInteractions,
            kind: newTippcardKind
        };
        firebase.database().ref('/userTippcards/'+this.props.tippcard.id+'/').update(newTippcard).then(this.closeModal).then(
            setTimeout(()=>{
                this.props.getUserTippcards();
            },1000)
        );
    }

    render() {
       let jsonOfCategories = this.props.categories;
       for(let i=0;i<Object.keys(jsonOfCategories).length;i++) {
           categories[i] = jsonOfCategories[i];
       }
       let categoriesOfActiveCard = [];
       let jsonOfChoosenCategories = this.props.tippcard.category;
       for(let i=0;i<Object.keys(jsonOfChoosenCategories).length;i++) {
           categoriesOfActiveCard[i] = jsonOfChoosenCategories[i].name;
       }
        allCategoryChecks = categories.map((category)=>{
            let categoryIsActive = false;
            for(let i=0;i<categoriesOfActiveCard.length;i++) {
                if(categoriesOfActiveCard[i]===category.name){
                    categoryIsActive = true;
                }
            }
            if(categoryIsActive){
                return <div key={category.name} style={{margin:'5px 0px'}}>
                    <input type="checkbox" id={category.name} name={category.name} onChange={(e)=>{this.toggleCategoryCheckboxValue(e.target.getAttribute('name'))}}/>
                    <label htmlFor={category.name}>{category.name}</label>
                </div>
            } else {
                return <div key={category.name} style={{margin:'5px 0px'}}>
                    <input type="checkbox" id={category.name} name={category.name} onChange={(e)=>{this.toggleCategoryCheckboxValue(e.target.getAttribute('name'))}}/>
                    <label htmlFor={category.name}>{category.name}</label>
                </div>
            }
        });

        let jsonOfInteractions = this.props.interactions;
        for(let i=0;i<Object.keys(jsonOfInteractions).length;i++) {
            interactions[i] = jsonOfInteractions[i];
        }
        allInteractionChecks = interactions.map((interaction)=>{
            let menu;
            if(interaction.name==='Map'){
                menu = ''
            }
            if(interaction.name==='Link'){
                menu = <div>
                    <label>Link Text:</label><br/>
                    <input id="LinkText" type="text" onChange={(e)=>{this.setLinkText(e)}}/>
                    <label>URL:</label><br/>
                    <input id="LinkURL" type="text" onChange={(e)=>{this.setLinkURL(e)}}/>
                </div>
            }
            return<div key={interaction.name} style={{margin:'5px 0px'}}>
                <input type="checkbox" id={interaction.name} name={interaction.name} onChange={(e)=>{this.toggleInteractionCheckboxValue(e.target.getAttribute('name'))}}/>
                <label htmlFor={interaction.name}>{interaction.name}</label>
                <div id={interaction.name+'Menu'} ref={interaction.name+'Menu'} className="interaction-menu-element" style={{display: this.state[interaction.name] ? 'block' : 'none' }}>
                    {menu}
                </div>
            </div>
        });

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
                            <h3>Ändern der Tippkarte {this.props.tippcard.id}</h3>
                            <div className="col s5" style={{marginTop: "20px"}}>
                                <div>
                                    <label>ID:</label><br/>
                                    <input disabled type="text" value={this.props.tippcard.id}/>
                                </div>
                                <label>Kategorie</label>
                                {allCategoryChecks}
                            </div>
                            <div className="col s5 offset-l2" style={{marginTop: "20px"}}>
                                <label>Text der Tippkarte</label>
                                <textarea id="textarea" className="materialize-textarea" onChange={(e)=>{this.setText(e)}}/>
                                {allInteractionChecks}
                            </div>
                        </div>
                        <div className="row" style={{textAlign: 'right', marginTop: '20px'}}>
                            <button className={'waves-effect waves-light btn'} style={{marginRight: '10px'}} onClick={this.closeModal}>
                                Abbrechen
                            </button>
                            <button ref="submit" className={'waves-effect waves-light btn'} onClick={this.handleSubmit}>
                                Bestätigen
                            </button>
                        </div>
                    </form>
                </Modal>
                <button className={'waves-effect waves-light btn'} onClick={this.openModal}>
                    Ändern
                </button>
            </div>
        )
    }
}




EditTippcardModal.propTypes = {
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

export default
//GoogleApiWrapper({
//   apiKey: ('AIzaSyCTs9gGQf9QKKmFQbksPxguxYHvHhlM3qU')
//})(
connect(mapStateToProps, {getTippcards, getUserTippcards, getInteractions, getCategories })(EditTippcardModal)
//);
