import { LoginPage } from "./pages/LoginPage/LoginPage.js"
import { RegPage } from "./pages/RegPage/RegPage.js";

const root = document.getElementById('root');
const page = new RegPage().render();

root.appendChild(page);