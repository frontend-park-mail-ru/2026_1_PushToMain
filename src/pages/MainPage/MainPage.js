import { BaseComponent } from "../../components/BaseComponent.js";
import { Sidebar } from "../../widgets/Sidebar/Sidebar.js";

export class MainPage extends BaseComponent {

    render(props) {
        const page = this.renderComponent('MainPage', {
            title: 'Главная',
        });

        const sidebar = new Sidebar().render({})

        const SigebarContainer = page.querySelector('.sidebar');
        SigebarContainer.appendChild(sidebar);

        return page;
    }
}
