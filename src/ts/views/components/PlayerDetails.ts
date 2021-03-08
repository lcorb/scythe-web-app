import { LitElement, html, css, property } from 'lit-element';
import icons from '../images/icons';
import glowButton from '../css/glow';

export class PlayerDetails extends LitElement {
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
            <h1></h1>

        `;
    }
}
customElements.define('player-details', PlayerDetails);
