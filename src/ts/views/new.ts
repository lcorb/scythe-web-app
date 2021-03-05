import { LitElement, html, css, property } from 'lit-element';
// @ts-ignore: parcel can use this notiation to pack these images
import { SelectBoard } from './components/SelectBoard';
import { SelectFaction } from './components/SelectFaction';

export default class NewGame extends LitElement {
    // private factions: string[];
    // private selected: { [x: string]: boolean };

    // static get properties() {
    //     return {
    //         factions: { attribute: false },
    //         selected: { attribute: true }
    //     }
    // }

    @property()
    factions: string[];
    selectedFactions: { [faction: string]: boolean }
    steps: any[];
    currentStep: number
    pairs: { [board: string]: string }

    static get styles() {
        return css`
        .faction-grid {
            display:grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 25px;
            padding: 25px;
            margin: auto;
            text-align: center;
        }
        
        .faction-grid img {
            display: block;
            margin: auto;
        }
        
        .faction-icon {
            height: 100px;
            width: 100px;
        }
        
        .faction-icon img {
            height:100%;
            width:100%;
        }
        
        .gray {
            filter: grayscale(90%);
        }`
    }

    constructor() {
        super();
        this.factions = [
            'crimea',
            'nordic',
            'polania',
            'rusviet',
            'saxony',
            'albion',
            'togawa',
            'fenris',
            'vesna',
        ];
        this.pairs = {};
        this.selectedFactions = {};
        this.currentStep = 0;
        this.steps = [
            this.displaySelectFaction,
            this.displaySelectBoard,
            this.displayScoreBoard
        ]
    }

    displaySelectFaction = () => {
        return new SelectFaction(this.goToNextStep, this.selectedFactions, this.updateSelectedFaction);
    }

    displaySelectBoard = () => {
        return new SelectBoard(this.goToNextStep, this.getSelectedFactions, this.updateBoardPairs);
    }

    displayScoreBoard = () => {

    }

    goToNextStep = () => {
        this.currentStep += 1;
        this.requestUpdate();
    }

    goToStep(step: number) {
        this.currentStep = step;
    }

    getSelectedFactions = () => {
        return this.selectedFactions;
    }

    updateSelectedFaction = (selectedFactions: { [faction: string]: boolean }) => {
        this.selectedFactions = selectedFactions;
    }

    updateBoardPairs = (pairs: { [board: string]: string }) => {
        this.pairs = pairs;
    }
    
    displayCurrentStep = () => {
        return this.steps[this.currentStep]();
    }

    render() {
        return html`
                ${this.displayCurrentStep()}
            `
    }
}

customElements.define('new-game', NewGame);