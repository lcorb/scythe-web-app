import { LitElement, html, css, property } from 'lit-element';
import icons from '../images/icons';
import glowButton from '../css/glow';

export class ScoreBoard extends LitElement {
    @property()


    static get styles() {
        return css`
        ${glowButton()}
        `;
    }

    constructor(next: () => void, getFactions: () => any, updateParent: any) {
        super();

    }


    render() {
        return html`
            <h1>What was the score?</h1>

        `;
    }
}
customElements.define('score-board', ScoreBoard);
