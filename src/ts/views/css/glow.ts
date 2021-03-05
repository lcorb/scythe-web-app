import { css } from 'lit-element';


const glowButton = (faction?: string) => {
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
export default glowButton;