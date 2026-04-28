import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import Textarea from "../../components/Textarea/Textarea";

import { sendSupportTicket } from "../../api/ApiSupport";

import "./SupportPage.scss";

class SupportPage extends Death13.Component {
	state: any = {
		category: { value: "", label: "" },
		problem: "",
		description: "",
	};

	handleCategoryChange = (value: any, label: any) => {
		this.setState({ category: { value, label } });
	};

	handleProblemChange = (event: any) => {
		this.setState({ problem: event.target.value });
	};

	handleDescriptionChange = (event: any) => {
		this.setState({ description: event.target.value });
	};

	handleSubmit = async () => {
		const { category, problem, description } = this.state;
		const payload = {
			theme: category.value,
			header: problem,
			quesion_text: description,
			timestamp: new Date().toISOString(),
		};

		try {
			await sendSupportTicket(payload);
			this.setState({
				category: { value: "", label: "" },
				problem: "",
				description: "",
			});
			const url = window.location.origin;
			window.parent.postMessage({ action: "closeSupportModal" }, url);
		} catch (error) {
			console.error("Failed to submit ticket:", error);
		}
	};

	render() {
		const ticketCategories = [
			{ value: "bug", label: "Ошибка" },
			{ value: "proposal", label: "Предложение" },
			{ value: "complaint", label: "Жалоба" },
			{ value: "other", label: "Другое" },
		];
		return (
			<div className="support-page-container">
				<h1 className="support-page__title">Расскажите о проблеме</h1>
				<span className="support-page__subtitle">
					С чем связано ваше обращение?
				</span>
				<Select
					id="category"
					options={ticketCategories}
					placeholder="Выберите категорию"
					onChange={this.handleCategoryChange}
				/>
				<Input
					input_title="Что за проблема?"
					placeholder="Краткое описание проблемы"
					onInput={this.handleProblemChange}
				/>
				<Textarea
					className="support-textarea"
					input_title="Подробное описание проблемы"
					placeholder="Опишите проблему максимально подробно"
					onInput={this.handleDescriptionChange}
				/>
				<Button title="Отправить" onClick={this.handleSubmit} />
			</div>
		);
	}
}

export default SupportPage;
