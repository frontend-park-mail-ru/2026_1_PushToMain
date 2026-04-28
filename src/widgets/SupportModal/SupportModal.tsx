import Death13 from "@react/stands";
import "./SupportModal.scss";

class SupportModal extends Death13.Component {
	state = {
		iframeKey: 0,
	};

	constructor(props: any) {
		super(props);

		window.addEventListener("message", this.handleMessage);
	}

	handleMessage = (event: MessageEvent) => {
		if (event.data.action === "closeSupportModal") {
			this.closeModal();
		}
	};

	closeModal = () => {
		const supportModal = document.querySelector(".support-modal");
		if (supportModal) {
			supportModal.classList.toggle("show");
			if (!supportModal.classList.contains("show")) {
				const iframe = document.querySelector(
					".support-iframe",
				) as HTMLIFrameElement;
				if (iframe) iframe.src = iframe.src;
			}
		}
	};

	render() {
		const url = new URL(document.URL);
		return (
			<div className="support-modal">
				<div className="support-modal-overlay" onClick={this.closeModal}></div>
				<iframe
					key={this.state.iframeKey}
					className="support-iframe"
					src={`${url.origin}/support`}
					height="200"
					width="200"
				></iframe>
			</div>
		);
	}
}

export default SupportModal;
