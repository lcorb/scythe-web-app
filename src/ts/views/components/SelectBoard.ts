import { LitElement, html, css, property } from 'lit-element';
import icons from '../images/icons';
import glowButton from '../css/glow';

export class SelectBoard extends LitElement {
    @property()
    boards: { [board: string]: string; };
    pairs: { [faction: string]: string; };
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
        ${glowButton()}
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
        this.factionsToCycle.forEach(faction => { this.pairs[faction] = ''; });
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
            });

            resolve(unassigned);
        });
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
            this.currentFaction += 1;
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
        });
    }

    render() {
        return html`
            <h1>Pick the board for <strong>${this.factionsToCycle[this.currentFaction]}</strong></h1>
            ${this.factionsToCycle.map((faction: string) => {
            return html`
                <img draggable='false' class=${this.currentFaction === this.factionsToCycle.indexOf(faction) ? 'icon selected' : 'icon disabled'} src='${icons[`${faction}_icon`]}' @click=${() => { this.gotoFaction(faction); }}></img>
            `;
        })}
            <div>
                ${Object.keys(this.boards).map((board: string) => {
            return html`
                        <div class=${this.currentlySelectedBoard === board ? 'selected-board' : 'board'} @click=${() => { this.selectBoard(board); }}>
                        ${board} ${this.boards[board] ? html`<img draggable='false' class='icon-small' src='${icons[`${this.boards[board]}_icon`]}'></img>` : ''}
                        </div>
                    `;
        })}
            </div>
            ${this.currentlySelectedBoard === '' ?
                html`<button disabled class='glow-button' ></button>`
                : html`<button class='glow-button' @click=${() => { this.nextFaction(); }}>Next</button>`}
        `;
    }
}
customElements.define('select-board', SelectBoard);
