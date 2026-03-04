import { BaseComponent } from "../../components/BaseComponent.js";
import { Button } from "../../components/Button/Button.js";

export class MainPage extends BaseComponent {

    render(props) {
        const page = this.renderComponent('MainPage', {
            title: 'Главная',
        });

        return page;
    }
}
