import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import * as firebase from 'firebase';
import { getTippcards } from "./../../../store/actions/tippcards";
import EditTippcardModal from './EditTippcardModal';
import ViewTippcardModal from './ViewTippcardModal';

let allTippcardElements;
let tippcards=[];
let categories=[];
let interactions=[];
let itemHasBeenDeleted = false;
let filterCategory = [];
let filterKind = [];
let filterInteraction = [];
let search=[];
let searchSucessfull = [];

class TippcardList extends Component {

    constructor(props){
        super(props);
        this.state = {
            reload: false,
            logoutEventFinished: false,
            activeBackendSection: 'tippcards',
            deleteModalIsOpen: false,
            itemToDelete: '',
            reloadState: false
        };
        this.props.getTippcards();

        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.afterOpenDeleteModal = this.afterOpenDeleteModal.bind(this);
        this.closeDeleteModal = this.closeDeleteModal.bind(this);
    }

    openDeleteModal(deleteId,deleteCategories,deleteText,deleteInteractions) {
        this.setState({
            deleteModalIsOpen: true,
            itemToDelete: deleteId,
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
        firebase.database().ref('/tippcards/').remove();
        setTimeout(()=>{
            firebase.database().ref('/tippcards/').set(allTippcards).then(this.closeDeleteModal).then(
                setTimeout(()=>{
                    itemHasBeenDeleted=true;
                    this.props.getTippcards();
                    document.getElementById('hiddenSubmitter').click();
                },1000))
        },2000)
    }

    render() {
        if(this.props.tippcards){
            if(JSON.stringify(this.props.tippcards) !== '[]'){
                if(!itemHasBeenDeleted){
                    let jsonOfTippcards = this.props.tippcards;
                    for(let i=0;i<Object.keys(jsonOfTippcards).length;i++) {
                        tippcards[i] = jsonOfTippcards[i];
                    }
                    itemHasBeenDeleted = false;
                } else {
                    let jsonOfTippcards = this.props.tippcards;
                    for(let i=0;i<Object.keys(jsonOfTippcards).length-2;i++) {
                        tippcards[i] = jsonOfTippcards[i];
                    }
                }
                allTippcardElements = tippcards.map((tippcard)=> {
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
                    let cardContent = <li key={tippcard.id} className={kindStyle}>
                        <div className="kind-description">
                            {kindDescription}
                        </div>
                        <div className="row">
                            <div className="col s6">
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
                            <div className="col s6" style={{textAlign: "right"}}>
                                <div className="row">
                                    <div className="col s4">
                                        <ViewTippcardModal tippcard={tippcard}/>
                                    </div>
                                    <div className="col s4">
                                        <EditTippcardModal tippcard={tippcard}/>
                                    </div>
                                    <div className="col s4">
                                        <button className={'waves-effect waves-light btn'} onClick={()=>{this.openDeleteModal(tippcard.id, categoriesElement, tippcard.text, interactionsElement)}}>
                                            Löschen
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>;
                    let isRenderFiltered=false;
                    if(this.props.filterCategory){
                        filterKind = this.props.filterCategory;
                    } else {
                        filterKind = [];
                    }
                    if(this.props.filterKind){
                        filterCategory = this.props.filterKind;
                    } else {
                        filterCategory = [];
                    }
                    if(this.props.filterInteraction){
                        filterInteraction = this.props.filterInteraction;
                    } else {
                        filterInteraction = [];
                    }
                    if(this.props.search){
                        search = this.props.search;
                    } else {
                        search = [];
                    }

                    if(filterKind.length>0 && filterCategory.length>0 && filterInteraction.length>0){
                        let categoryChecker = false;
                        for(let i=0; i<categories.length;i++){
                            for(let j=0; j<filterCategory.length;j++) {
                                if(categories[i] === filterCategory[j]){
                                    categoryChecker = true;
                                }
                            }
                        }
                        let kindChecker = false;
                        for(let i=0;i<filterKind.length; i++){
                            if(tippcard.kind === filterKind[i]){
                                kindChecker = true;
                            }
                        }
                        let interactionChecker = false;
                        for(let i=0; i<interactions.length;i++){
                            for(let j=0; j<filterInteraction.length;j++) {
                                if(interactions[i].name === filterInteraction[j]){
                                    interactionChecker = true;
                                }
                            }
                        }
                        if(kindChecker && categoryChecker && interactionChecker){
                            isRenderFiltered=false;
                        } else {
                            isRenderFiltered=true;
                        }
                    } else {
                        let areTwoCoosen = false;
                        if (filterKind.length>0 && filterCategory.length>0){
                            areTwoCoosen = true;
                            let categoryChecker = false;
                            for(let i=0; i<categories.length;i++){
                                for(let j=0; j<filterCategory.length;j++) {
                                    if(categories[i] === filterCategory[j]){
                                        categoryChecker = true;
                                    }
                                }
                            }
                            let kindChecker = false;
                            for(let i=0;i<filterKind.length; i++){
                                if(tippcard.kind === filterKind[i]){
                                    kindChecker = true;
                                }
                            }
                            if(kindChecker && categoryChecker){
                                isRenderFiltered=false;
                            } else {
                                isRenderFiltered=true;
                            }
                        }
                        if (filterCategory.length>0 && filterInteraction.length>0){
                            areTwoCoosen = true;
                            let categoryChecker = false;
                            for(let i=0; i<categories.length;i++){
                                for(let j=0; j<filterCategory.length;j++) {
                                    if(categories[i] === filterCategory[j]){
                                        categoryChecker = true;
                                    }
                                }
                            }
                            let interactionChecker = false;
                            for(let i=0; i<interactions.length;i++){
                                for(let j=0; j<filterInteraction.length;j++) {
                                    if(interactions[i].name === filterInteraction[j]){
                                        interactionChecker = true;
                                    }
                                }
                            }
                            if(interactionChecker && categoryChecker){
                                isRenderFiltered=false;
                            } else {
                                isRenderFiltered=true;
                            }
                        }
                        if (filterKind.length>0 && filterInteraction.length>0){
                            areTwoCoosen = true;
                            let kindChecker = false;
                            for(let i=0;i<filterKind.length; i++){
                                if(tippcard.kind === filterKind[i]){
                                    kindChecker = true;
                                }
                            }
                            let interactionChecker = false;
                            for(let i=0; i<interactions.length;i++){
                                for(let j=0; j<filterInteraction.length;j++) {
                                    if(interactions[i].name === filterInteraction[j]){
                                        interactionChecker = true;
                                    }
                                }
                            }
                            if(interactionChecker && kindChecker){
                                isRenderFiltered=false;
                            } else {
                                isRenderFiltered=true;
                            }
                        }
                        if(!areTwoCoosen){
                            if(filterCategory.length>0){
                                let categoryChecker = false;
                                for(let i=0; i<categories.length;i++){
                                    for(let j=0; j<filterCategory.length;j++) {
                                        if(categories[i] === filterCategory[j]){
                                            categoryChecker = true;
                                        }
                                    }
                                }
                                if(categoryChecker){
                                    isRenderFiltered=false;
                                } else {
                                    isRenderFiltered=true;
                                }
                            }
                            if(filterKind.length>0){
                                let kindChecker = false;
                                for(let i=0;i<filterKind.length; i++){
                                    if(tippcard.kind === filterKind[i]){
                                        kindChecker = true;
                                    }
                                }
                                if(kindChecker){
                                    isRenderFiltered=false;
                                } else {
                                    isRenderFiltered=true;
                                }
                            }
                            if(filterInteraction.length>0){
                                let interactionChecker = false;
                                for(let i=0; i<interactions.length;i++){
                                    for(let j=0; j<filterInteraction.length;j++) {
                                        if(interactions[i].name === filterInteraction[j]){
                                            interactionChecker = true;
                                        }
                                    }
                                }
                                if(interactionChecker){
                                    isRenderFiltered=false;
                                } else {
                                    isRenderFiltered=true;
                                }
                            }
                        }
                    }

                    if(!isRenderFiltered){
                        searchSucessfull[tippcard.id]=false;
                        for(let i=0;i<search.length;i++){
                            if(search[i]!==''){
                                if(tippcard.text.toLowerCase().indexOf(search[i]) !== -1){
                                    searchSucessfull[tippcard.id]=true;
                                }
                                for(let i=0; i<interactions.length;i++){
                                    if(interactions[i].name==='Link'){
                                        if(interactions[i].link.toLowerCase().indexOf(search[i]) !== -1){
                                            searchSucessfull[tippcard.id]=true;
                                        }
                                        if(interactions[i].linkText.toLowerCase().indexOf(search[i]) !== -1){
                                            searchSucessfull[tippcard.id]=true;
                                        }
                                    }
                                }
                            }
                        }

                        if(search.length>0){
                            if(searchSucessfull[tippcard.id]){
                                isRenderFiltered=false;
                            } else {
                                isRenderFiltered=true;
                            }
                        }
                    }

                    if(!isRenderFiltered){
                        return cardContent
                    } else {
                        return '';
                    }
                });
            }
        } else {
            allTippcardElements = 'Es gibt momentan keine Tippkarten!';
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
                    <p>Du bist im Begriff diese Tippkarte {this.state.itemToDelete} zu löschen. Willst du das wirklich tun?</p>
                    <div className="collection-item-element">
                        <ul className="collection">
                            <li key={this.state.itemToDelete} className="collection-item-element">
                                <div className="row">
                                    <div className="col s12">
                                        <div className="row">
                                            <div className="col s1">
                                                <strong>{this.state.itemToDelete}</strong>
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
                            <button className={'waves-effect waves-light btn'}  onClick={e => this.deleteTippcard(this.state.itemToDelete,e,tippcards)}>
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
}

const mapStateToProps = state => ({
    tippcards: state.tippcards.tippcards,
});

export default connect(mapStateToProps, { getTippcards }) (TippcardList);