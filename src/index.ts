import { render } from "lit-html";
import Landing from "./js/components/landing";
import NewGame from "./js/components/new";

const routes: { [x: string]: any; } = {
    "/": Landing,
    "/new": NewGame
}

const router = async () => {

    const view = new routes[location.pathname as keyof string];

    const main = <HTMLElement>document.querySelector(".main");
    main.appendChild( view );
    // render(view.render(), main);
};

const navigateTo = (url: string | null | undefined) => {
    history.pushState(null, '', url);
    router();
};


window.addEventListener("popstate", router);
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (e: any) => {
        if (e.target.matches("[route]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
    router();
});