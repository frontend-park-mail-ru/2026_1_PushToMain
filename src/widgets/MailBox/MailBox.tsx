import Death13 from "@react/stands";
import "./MailBox.scss";

class MailBox extends Death13.Component {
	state: any = {
		isFavorite: false,
	};

	handleSelect = (e: any) => {
		e.stopPropagation();
		const { id, onSelect } = this.props;
		if (onSelect) {
			onSelect(id, e.target.checked);
		}
	};

	handleFavorite = (e: any) => {
		e.stopPropagation();
		this.setState({ isFavorite: e.target.checked });
	};

	render() {
		const {
			theme,
			sender_name,
			sender_surname,
			sender_email,
			title,
			date,
			onClick,
			isSelected = false,
			isRead,
		} = this.props;
		const { isFavorite } = this.state;

		return (
			<div
				className={`mail ${isSelected ? "selected" : ""} ${isRead ? "read" : ""}`}
				onClick={onClick}
			>
				<div className="checkbox-container">
					<input
						type="checkbox"
						name="select-checkbox"
						checked={isSelected}
						onChange={this.handleSelect}
						onClick={(e: any) => e.stopPropagation()}
					/>
					<input
						type="checkbox"
						name="favorites-checkbox"
						checked={isFavorite}
						onChange={this.handleFavorite}
						onClick={(e: any) => e.stopPropagation()}
					/>
				</div>
				<div className="mail-content">
					<div className="mail-content__left-part">
						<span className="mail-sender">
							<div className={`unread-dot ${isRead ? "mail-read" : ""}`}></div>
							{sender_name !== ""
								? `${sender_name} ${sender_surname}`
								: sender_email}
						</span>
						<div className="mail-text-content">
							<span className="mail-theme">{theme}</span>
							<span className="mail-title">{title}</span>
							<span className="mail-date">{date}</span>
						</div>
					</div>
					<div className="mail-content__right-part-mobile">
						<span className="mail-date-mobile">{date}</span>
						<input
							className="favorites-checkbox-mobile"
							type="checkbox"
							name="favorites-checkbox"
							checked={isFavorite}
							onChange={this.handleFavorite}
							onClick={(e: any) => e.stopPropagation()}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default MailBox;
