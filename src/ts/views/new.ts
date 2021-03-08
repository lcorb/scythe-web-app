import { LitElement, html, css, property } from 'lit-element';
import { ScoreBoard } from './components/ScoreBoard';
import { SelectBoard } from './components/SelectBoard';
import { SelectFaction } from './components/SelectFaction';
import { StepProgress } from './components/StepProgress';

interface Score {
    stars: number;
    coins: number;
}

export interface Faction {
    name: string;
    board: string;
    player?: string;
    score?: Score;
}

export default class NewGame extends LitElement {
    @property()
    factions: string[];
    selectedFactions: { [faction: string]: Faction }
    steps: any[];
    currentStep: number
    stepTitles: string[];

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
        this.selectedFactions = {};
        this.currentStep = 0;
        this.steps = [
            this.displaySelectFaction,
            this.displaySelectBoard,
            this.displayScoreBoard
        ]
        this.stepTitles = [
            'Select Faction',
            'Select Board',
            'Enter Score'
        ]
    }

    displaySelectFaction = () => {
        return new SelectFaction(this.goToNextStep, this.selectedFactions, this.updateSelectedFaction);
    }

    displaySelectBoard = () => {
        return new SelectBoard(this.goToNextStep, this.getSelectedFactions, this.updateSelectedFaction);
    }

    displayScoreBoard = () => {
        // return new ScoreBoard(this.goToNextStep, this.getPairs, this.updateScore)
    }

    displayStepProgress = () => {
        return new StepProgress(this.stepTitles, this.currentStep, this.goToStep);
    }

    goToNextStep = () => {
        this.currentStep += 1;
        this.requestUpdate();
    }

    goToStep = (step: number) => {
        this.currentStep = step;
        this.requestUpdate();
    }

    getSelectedFactions = () => {
        return this.selectedFactions;
    }

    updateSelectedFaction = (selectedFactions: { [faction: string]: Faction }) => {
        this.selectedFactions = selectedFactions;
    }

    displayCurrentStep = () => {
        return this.steps[this.currentStep]();
    }

    render() {
        return html`
                ${this.displayStepProgress()}
                ${this.displayCurrentStep()}
            `
    }
}

customElements.define('new-game', NewGame);