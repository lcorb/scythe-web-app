import { LitElement, html, css, property } from 'lit-element';
import icons from '../images/icons';
import glowButton from '../css/glow';

export class SelectFaction extends LitElement {
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
    selectedFactions: { [faction: string]: boolean; } = {};
    updateParent: any;
    next: () => void;
    maximumFactions: number;
    firstRender: boolean;
    recentlyUnselectedFaction: string;

    constructor(next: () => void, selectedFactions: { [faction: string]: boolean; }, updateParent: any) {
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
        ${glowButton()}`;
    }

    displayFactions = () => {
        return this.factions.map(v => {
            let path = icons[`${v}_icon`];
            let shake = this.recentlyUnselectedFaction === v ? ' shake' : '';
            return html`<img draggable='false' 
            class=${this.selectedFactions[v] ? 'faction-icon' : 'faction-icon gray' + shake}
            src='${path}'
    @click=${() => { this.selectFaction(v); }} ></img>`;
        });
    };

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
    };

    render() {
        return html`
            <h1>Who is playing?</h1>
            <div class='faction-grid'>
                ${this.displayFactions()}
            </div>
            ${Object.keys(this.selectedFactions).length > 0 ?
                html`<button class='glow-button' @click=${() => { this.next(); }}>Next</button>`
                :
                html`<button disabled class='glow-button' ></button>`}
        `;
    }
}
customElements.define('select-faction', SelectFaction);
