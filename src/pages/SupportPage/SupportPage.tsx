import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import Textarea from "../../components/Textarea/Textarea";

import "./SupportPage.scss";

class SupportPage extends Death13.Component {
  state: any = {};

  render() {
    const ticketCategories = [
      { value: "bug", label: "Ошибка" },
      { value: "feature", label: "Предложение" },
      { value: "support", label: "Помощь" },
      { value: "general", label: "Общее" },
    ];
    return (
      <div className="support-page-container">
        <h1 className="support-page__title">Расскажите о проблеме</h1>
        <span className="support-page__subtitle">
          С чем связано ваше обращение?
        </span>
        <Select options={ticketCategories} placeholder="Выберите категорию" />
        <Input
          input_title="Что за проблема?"
          placeholder="Краткое описание проблемы"
        />
        <Textarea
          className="support-textarea"
          input_title="Подробное описание проблемы"
          placeholder="Опишите проблему максимально подробно"
        />
        <Button title="Отправить" />
      </div>
    );
  }
}

export default SupportPage;
