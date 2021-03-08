import { LitElement, html, css, property } from 'lit-element';

export class StepProgress extends LitElement {
    @property()
    steps: string[]
    currentStep: number
    gotoStep: any

    static get styles() {
        return css`
        ul {
            list-style:none;
        }
        li {
            display: inline;
            padding: 8px;
            margin: 5px;
        }
        .skew {
            transform: skew(15deg, 0deg);
        }
        .step {
            background-color: gray;
        }
        .current {
            background-color: skyblue;
        }
        `;
    }

    constructor(steps: string[], currentStep: number, gotoStep: any) {
        super();
        this.steps = steps;
        this.currentStep = currentStep;
        this.gotoStep = gotoStep;
    }

    mapSteps() {
        return this.steps.map((step, i) => {
            return html`<li class=${i === this.currentStep ? 'step current skew': 'step skew'} @click=${() => this.gotoStep(i)}>${step}</li>`;
        })
    }


    render() {
        return html`
        <ul>
            ${this.mapSteps()}
        </ul>
        `;
    }
}
customElements.define('step-progress', StepProgress);
