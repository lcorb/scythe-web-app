import { LitElement, html, css, property } from 'lit-element';
import icons from '../../public/images/factions/*.png';

const btnCSS = (faction?: string) => {
    return css`
    .glow-button {
        width: 150px;
        height: 50px;
        border: none;
        outline: none;
        color: #fff;
        background: rgba(66, 66, 66, 0.4);
        cursor: pointer;
        position: relative;
        z-index: 0;
        border-radius: 10px;
        margin: auto;
        display: block;
    }

    .glow-button:before {
        content: '';
        background: linear-gradient(90deg, #b883c9, #956ace, #763ae6, #7912ff, #775f9e, #a084c4, #b883c9);
        position: absolute;
        top: -2px;
        left: -2px;
        background-size: 600%;
        z-index: -1;
        filter: blur(10px);
        width: calc(100% + 4px);
        height: calc(100% + 4px);
        animation: glowing 90s linear infinite;
        opacity: 0.7;
        transition: opacity .3s ease-in-out;
        border-radius: 10px;
    }

    .glow-button:active {
        background: rgba(255, 255, 255, 0);
        transition: 1s ease-in-out;
        opacity: 1;
    }

    .glow-button:active:after {
        background: transparent;
    }

    .glow-button:hover:after {
        opacity: 0.5;
        transition: .3s ease-in-out;
    }

    .glow-button:after {
        z-index: -1;
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgb(61, 71, 86, 0.2);
        left: 0;
        top: 0;
        border-radius: 10px;
        transition: .5s ease-in-out;
    }

    .glow-button:disabled:before {
        opacity: 0;
    }

    @keyframes glowing {
        0% { background-position: 0 0; }
        50% { background-position: 400% 0; }
        100% { background-position: 0 0; }
    }
    `
}

class SelectFaction extends LitElement {
    @property()
    factions = [
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
    selectedFactions: { [faction: string]: boolean } = {};
    updateParent: any;
    next: () => void;
    maximumFactions: number;
    firstRender: boolean;
    recentlyUnselectedFaction: string;

    constructor(next: () => void, selectedFactions: { [faction: string]: boolean }, updateParent: any) {
        super();
        this.next = next;
        this.selectedFactions = selectedFactions;
        this.updateParent = updateParent;
        this.maximumFactions = 7;
        this.firstRender = true;
        this.recentlyUnselectedFaction = '';
    }

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

        .shake {
            animation: shake .5s;
        }
        
        .gray {
            transition: filter .3s ease-out;
            filter: grayscale(90%);
        }

        @keyframes shake {
            0% { transform: translate(10px, 0px); }
            25% { transform: translate(-10px, 0px); }
            50% { transform: translate(10px, 0px); }
            75% { transform: translate(-5px, 0px); }
            100% { transform: translate(0px, 0px); }
        }
        ${btnCSS()}`
    }

    displayFactions = () => {
        return this.factions.map(v => {
            let path = icons[`${v}_icon`];
            let shake = this.recentlyUnselectedFaction === v ? ' shake' : '';
            return html`<img draggable='false' 
            class=${this.selectedFactions[v] ? 'faction-icon' : 'faction-icon gray' + shake }
            src='${path}'
    @click=${()=> { this.selectFaction(v) }} ></img>`;
        });
    }

    selectFaction = (faction: string) => {
        if (this.selectedFactions[faction]) {
            delete this.selectedFactions[faction];
        } else {
            this.selectedFactions[faction] = true;
        }

        const keys = Object.keys(this.selectedFactions);

        if (keys.length > this.maximumFactions) {
            this.recentlyUnselectedFaction = keys[0];
            delete this.selectedFactions[keys[0]];
        }

        this.updateParent(this.selectedFactions);
        // need to create directive to handle updating
        // https://codepen.io/sorvell/pen/BeLqMN?editors=0010
        this.requestUpdate();
    }

    render() {
        return html`
            <h1>Who is playing?</h1>
            <div class='faction-grid'>
                ${this.displayFactions()}
            </div>
            ${Object.keys(this.selectedFactions).length > 0 ?
                html`<button class='glow-button' @click=${()=> { this.next() }}>Next</button>`
            :   
                html`<button disabled class='glow-button' ></button>`
            
            }
        `
    }
}

customElements.define('select-faction', SelectFaction);


class SelectBoard extends LitElement {
    @property()
    boards: { [board: string]: string };
    pairs: { [faction: string]: string };
    factionsToCycle: string[] = [];
    currentFaction: number;
    getFactions: () => string[];
    next: () => void;
    currentlySelectedBoard: string;
    updateParent: any;

    static get styles() {
        return css`
        h1 strong {
            text-transform: capitalize;
        }

        .icon {
            height: 100px;
            width: 100px;
            transition: .3s all ease-in;
        }

        .icon-small {
            height: 20px;
            width: 20px;
        }
        
        .selected {
            will-change: transform;
            transition: .3s all ease-out;
            transform: translateY(-10px);
        }
        .disabled{
            will-change: transform;
            transition: .5s all;
            filter: grayscale(90%);
        }
        .board {
            transition: border .3s ease-in;
            border: 2px solid gray;
        }
        .selected-board {
            transition: border .1s ease-out;
            border: 2px solid goldenrod;
        }
        ${btnCSS()}
        `;
    }

    constructor(next: () => void, getFactions: () => any, updateParent: any) {
        super();
        this.boards = {
            'Agricultural': '',
            'Engineering': '',
            'Industrial': '',
            'Innovative': '',
            'Mechanical': '',
            'Militant': '',
            'Patriotic': '',
        },
        this.next = next;
        this.getFactions = getFactions;
        this.currentFaction = 0;
        this.currentlySelectedBoard = '';
        this.updateParent = updateParent;
        this.pairs = {};

        this.updateFactions();
    }

    updateFactions() {
        this.factionsToCycle = Object.keys(this.getFactions());
        this.factionsToCycle.forEach(faction => { this.pairs[faction] = '' })
    }

    selectBoard(board: string) {
        const faction = this.factionsToCycle[this.currentFaction];

        if (this.currentlySelectedBoard === board) {
            this.boards[board] = '';
            this.currentlySelectedBoard = '';
        } else {
            // when current faction is assigned a board
            // check if the new board belongs to another faciton
            // if so, switch their boards else assign a blank board
            if (this.boards[board] && this.boards[board] !== faction) {
                if (this.pairs[faction]) {
                    let newBoard = this.pairs[faction];
                    let otherFaction = this.boards[board];

                    this.boards[newBoard] = otherFaction;
                    this.pairs[otherFaction] = newBoard;
                }
            } else {
                if (this.pairs[faction]) {
                    this.boards[this.pairs[faction]] = '';
                }
            }

            this.boards[board] = faction;

            this.currentlySelectedBoard = board;
        }
        this.pairs[faction] = this.currentlySelectedBoard;
        this.requestUpdate();
    }

    gotoFaction(faction: string) {
        if (this.pairs[faction]) {
            this.currentlySelectedBoard = this.pairs[faction];
        } else {
            this.currentlySelectedBoard = '';
        }

        this.currentFaction = this.factionsToCycle.indexOf(faction);

        this.requestUpdate();
    }

    checkUnassignedFactions() {
        return new Promise(resolve => {
            let unassigned: string[] = [];
            Object.keys(this.pairs).forEach((faction: string) => {
                if (!this.pairs[faction]) {
                    unassigned.push(faction);
                }
            })

            resolve(unassigned);
        })
    }
    
    async nextFaction() {
        let unassignedFactions: string[] | any = await this.checkUnassignedFactions();

        if (!unassignedFactions.length) {
            this.updateParent(this.pairs);
            return this.next();

        } else if (this.currentFaction === this.factionsToCycle.length - 1) {
            this.gotoFaction(unassignedFactions[0]);

        } else if (!unassignedFactions.includes(this.factionsToCycle[this.currentFaction + 1])) {
            this.gotoFaction(unassignedFactions[0]);
        }
        else {
            this.currentFaction +=1;
            this.currentlySelectedBoard = this.pairs[this.currentFaction] ? this.pairs[this.currentFaction] : '';
            this.requestUpdate();
        }
        
    }

    findFactionWithBoard(board: string) {
            Object.keys(this.pairs).forEach((faction, i) => {
                if (this.pairs[faction] === board) {
                    return faction;
                } else if (i === Object.keys(this.pairs).length - 1) {
                    return false;
                }
            })
    }

    render() {
        return html`
            <h1>Pick the board for <strong>${this.factionsToCycle[this.currentFaction]}</strong></h1>
            ${this.factionsToCycle.map((faction: string) => {
            return html`
                <img draggable='false' class=${this.currentFaction === this.factionsToCycle.indexOf(faction) ? 'icon selected' : 'icon disabled' } src='${icons[`${faction}_icon`]}' @click=${() => { this.gotoFaction(faction) }}></img>
            `
            })}
            <div>
                ${Object.keys(this.boards).map((board: string )=> {
                    return html`
                        <div class=${this.currentlySelectedBoard === board ? 'selected-board' : 'board' } @click=${() => { this.selectBoard(board) }}>
                        ${board} ${this.boards[board] ? html`<img draggable='false' class='icon-small' src='${icons[`${this.boards[board]}_icon`]}'></img>` : ''}
                        </div>
                    ` 
                })}
            </div>
            ${this.currentlySelectedBoard === '' ? 
                html`<button disabled class='glow-button' ></button>`
            :   html`<button class='glow-button' @click=${()=> { this.nextFaction() }}>Next</button>`
            }
        `
    }
}

customElements.define('select-board', SelectBoard);

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