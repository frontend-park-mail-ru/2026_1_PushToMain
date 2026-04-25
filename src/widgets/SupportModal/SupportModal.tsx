import Death13 from "@react/stands";
import "./SupportModal.scss";

class SupportModal extends Death13.Component {
  closeModal = () => {
    const supportModal = document.querySelector(".support-modal");
    if (supportModal) {
      supportModal.classList.toggle("show");
    }
  };

  render() {
    return (
      <div className="support-modal">
        <div className="support-modal-overlay" onClick={this.closeModal}></div>
        <iframe
          className="support-iframe"
          src={`${document.URL}support`}
          height="200"
          width="200"
        ></iframe>
      </div>
    );
  }
}

export default SupportModal;
