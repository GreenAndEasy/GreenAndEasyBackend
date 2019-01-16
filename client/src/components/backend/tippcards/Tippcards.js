import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NewTippcardModal from './NewTippcardModal';
import TippcardList from './TippcardList';
import { getTippcards } from "./../../../store/actions/tippcards";
import { getCategories } from "./../../../store/actions/categories";
import { getKinds } from "./../../../store/actions/kinds";
import { getInteractions} from "../../../store/actions/interactions";


let allCategoryChecks;
let categories = [];
let allKindChecks;
let kinds = [];
let allInteractionChecks;
let interactions = [];
let categoriesToFilter = [];
let kindsToFilter = [];
let interactionsToFilter = [];


class Tippcards extends Component {

    constructor(props) {
        super(props);

        // Bind the this context to the handler function
        this.toggleFilterMenu = this.toggleFilterMenu.bind(this);
        this.rerender = this.rerender.bind(this);
        this.deleteEl = this.deleteEl.bind(this);
        this.toggleCategoryCheckboxValue = this.toggleCategoryCheckboxValue.bind(this);
        this.toggleKindCheckboxValue = this.toggleKindCheckboxValue.bind(this);
        this.setupSearch = this.setupSearch.bind(this);

        // Set some state
        this.state = {
            reloadState: false,
            reloadDeleteState: false,
            filterMenu: false,
            filterCategory: [],
            filterKind: [],
            filterInteraction: [],
            search: [],
            filterActive: false,
            searchActive: false
        };
        this.props.getCategories();
        this.props.getKinds();
        this.props.getInteractions();
    }

    toggleFilterMenu(categories, kinds, interactions){
        if(!this.state.filterActive){
            this.setState({filterMenu: !this.state.filterMenu});
        }

        if(!this.state.filterMenu){
            this.setState({filterCategory: []});
            this.setState({filterKind: []});
            this.setState({filterInteraction: []});
            categoriesToFilter=[];
            kindsToFilter=[];
            interactionsToFilter=[];
            this.setState({filterActive: false})
        } else {
            console.log(categories);
            console.log(kinds);
            console.log(interactions);
            this.setState({filterCategory: categories});
            this.setState({filterKind: kinds});
            this.setState({filterInteraction: interactions});
            if(categories.length>0||kinds.length>0||interactions.length>0){
                this.setState({filterActive: true})
            }
        }
    }

    toggleCategoryCheckboxValue(category){
        let addCategoryToFilter = true;
        let categoryToDelete = null;
        for(let i=0; i<=categoriesToFilter.length;i++){
            if(category === categoriesToFilter[i]){
                addCategoryToFilter = false;
                categoryToDelete=i;
            }
        }
        if(addCategoryToFilter){
            categoriesToFilter.push(category);
        } else {
            this.setState({[categoriesToFilter[categoryToDelete]]: false});
            let arr1 = categoriesToFilter.slice(0,categoryToDelete);
            let arr2 = categoriesToFilter.slice(categoryToDelete+1,categoriesToFilter.length+1);
            categoriesToFilter = arr1.concat(arr2);
        }
    }

    toggleKindCheckboxValue(kind){
        let addKindToFilter = true;
        let kindToDelete = null;
        for(let i=0; i<=kindsToFilter.length;i++){
            if(kind === kindsToFilter[i]){
                addKindToFilter = false;
                kindToDelete=i;
            }
        }
        if(addKindToFilter){
            kindsToFilter.push(kind);
        } else {
            this.setState({[kindsToFilter[kindToDelete]]: false});
            let arr1 = kindsToFilter.slice(0,kindToDelete);
            let arr2 = kindsToFilter.slice(kindToDelete+1,kindsToFilter.length+1);
            kindsToFilter = arr1.concat(arr2);
        }
    }

    toggleInteractionCheckboxValue(interaction){
        let addInteractionToFilter = true;
        let interactionToDelete = null;
        for(let i=0; i<=interactionsToFilter.length;i++){
            if(interaction === interactionsToFilter[i]){
                addInteractionToFilter = false;
                interactionToDelete=i;
            }
        }
        if(addInteractionToFilter){
            interactionsToFilter.push(interaction);
        } else {
            this.setState({[interactionsToFilter[interactionToDelete]]: false});
            let arr1 = interactionsToFilter.slice(0,interactionToDelete);
            let arr2 = interactionsToFilter.slice(interactionToDelete+1,interactionsToFilter.length+1);
            interactionsToFilter = arr1.concat(arr2);
        }
    }

    setupSearch(){
        let allSearchTerms;
        let searchText = document.getElementById('SearchTest').value;
        searchText = searchText.toLowerCase();
        allSearchTerms = searchText.trim().split(" ");
        for(let i=0;i<allSearchTerms.length;i++){
            if(allSearchTerms[i].length<2){
                let arr1 = allSearchTerms.slice(0,i);
                let arr2 = allSearchTerms.slice(i+1,allSearchTerms.length+1);
                allSearchTerms = arr1.concat(arr2);
            }
        }
        this.setState({search: allSearchTerms});
        if(allSearchTerms.length>0){
            this.setState({searchActive: true});
        } else {
            this.setState({searchActive: false});
        }
        document.getElementById('SearchTest').value='';
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
        let tippcardList='';
        if(this.state.filterCategory.length>0 || this.state.filterKind.length>0 || this.state.filterInteraction.length>0 || this.state.search.length>0){
            tippcardList=<TippcardList filterCategory={this.state.filterCategory} filterKind={this.state.filterKind} filterInteraction={this.state.filterInteraction} search={this.state.search}/>
        } else {
            tippcardList=<TippcardList/>
        }
        let jsonOfCategories = this.props.categories;
        for(let i=0;i<Object.keys(jsonOfCategories).length;i++) {
            categories[i] = jsonOfCategories[i];
        }
        allCategoryChecks = categories.map((category)=>{
            return<div key={category.name} style={{margin:'5px 0px'}}>
                <input type="checkbox" id={category.name} name={category.name} onChange={(e)=>{this.toggleCategoryCheckboxValue(e.target.getAttribute('name'))}}/>
                <label htmlFor={category.name}>{category.name}</label>
            </div>
        });
        let jsonOfKinds = this.props.kinds;
        for(let i=0;i<Object.keys(jsonOfKinds).length;i++) {
            kinds[i] = jsonOfKinds[i];
        }
        allCategoryChecks = categories.map((category)=>{
            return<div key={category.name} style={{margin:'5px 0px'}}>
                <input type="checkbox" id={category.name} name={category.name} onChange={(e)=>{this.toggleKindCheckboxValue(e.target.getAttribute('name'))}}/>
                <label htmlFor={category.name}>{category.name}</label>
            </div>
        });

        let jsonOfInteractions = this.props.interactions;
        for(let i=0;i<Object.keys(jsonOfInteractions).length;i++) {
            interactions[i] = jsonOfInteractions[i];
        }
        allInteractionChecks = interactions.map((interaction)=>{
            return<div key={interaction.name} style={{margin:'5px 0px'}}>
                <input type="checkbox" id={interaction.name} name={interaction.name} onChange={(e)=>{this.toggleInteractionCheckboxValue(e.target.getAttribute('name'))}}/>
                <label htmlFor={interaction.name}>{interaction.name}</label>
            </div>
        });
        allKindChecks = kinds.map((kind)=>{
            return<div key={kind.name} style={{margin:'5px 0px'}}>
                <input type="checkbox" id={kind.name} name={kind.name} onChange={(e)=>{this.toggleCategoryCheckboxValue(e.target.getAttribute('name'))}}/>
                <label htmlFor={kind.name}>{kind.name}</label>
            </div>
        });
        let filterMenu ='';
        if(this.state.filterMenu){
            filterMenu = <div className="filter-menu row">
                    <div className="col s6">
                        <h5>Kategorie</h5>
                        {allCategoryChecks}
                    </div>
                    <div className="col s6">
                        <h5>Quelle</h5>
                        {allKindChecks}
                        <h5>Funktion</h5>
                        {allInteractionChecks}
                    </div>
                </div>
        }
        let filterActive = 'waves-effect waves-light btn';
        if(this.state.filterActive){
            filterActive= 'waves-effect waves-light btn active-button'
        }
        let searchActive = 'waves-effect waves-light btn';
        if(this.state.searchActive){
            searchActive= 'waves-effect waves-light btn active-button'
        }
        return (
            <div>
                <div className="row">
                    <div className="col s7">
                        <div className="row">
                            <div className="col s5" >
                                <h4>Tippkarten</h4>
                            </div>
                            <div className="col s7" >
                                {filterMenu}
                            </div>
                        </div>
                    </div>
                    <div className="col s5" style={{textAlign: 'right', marginTop: '15px'}}>
                        <div className="row">
                            <div className="col s6" style={{textAlign: 'left'}}>
                                <button className={filterActive} onClick={()=>{this.toggleFilterMenu(categoriesToFilter,kindsToFilter,interactionsToFilter)}}>
                                    Filtern
                                </button>
                            </div>
                            <div className="col s6">
                                <NewTippcardModal/>
                            </div>
                        </div>
                        <div className="row" style={{marginTop: '20px'}}>
                            <div className="col s7">
                                <input id="SearchTest" type="text"/>
                            </div>
                            <div className="col s5">
                                <button className={searchActive} onClick={this.setupSearch}>
                                    Suchen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col s5 offset-s7" style={{textAlign: 'right', marginTop: '15px'}}>

                    </div>
                </div>
                {tippcardList}
            </div>
        )
    }
}

Tippcards.propTypes = {
    getTippcards: PropTypes.func.isRequired,
    getInteractions: PropTypes.func.isRequired,
    getCategories: PropTypes.func.isRequired,
    getKinds: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    tippcards: state.tippcards.tippcards,
    categories: state.categories.categories,
    interactions: state.interactions.interactions,
    kinds: state.kinds.kinds
});

export default connect(mapStateToProps, { getTippcards, getCategories, getKinds, getInteractions }) (Tippcards);