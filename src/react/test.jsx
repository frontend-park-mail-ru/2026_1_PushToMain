/** @jsx createElement */
/** @jsxFrag Fragment */
import { createElement, render } from "./index";

const App = () => {
    return (
        <div style="padding: 20px; text-align: center;">
            <h1 style="color: blue;">Привет, мир!</h1>
            <p>Это мой React</p>
            <button onClick={() => alert("Клик!")}>Нажми меня</button>
        </div>
    );
};

const root = document.getElementById("root");
if (root) {
    render(<App />, root);
}
