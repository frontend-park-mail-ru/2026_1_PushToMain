import Death13 from "@react/stands";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

class PopupManager extends Death13.Component {
  static instance: PopupManager | null = null;

  static show(status: boolean, message?: string): void {
    if (PopupManager.instance) {
      PopupManager.instance.addModal(status, message);
    }
  }

  constructor(props: any) {
    super(props);
    PopupManager.instance = this;
    this.state = { modals: [] };
  }

  componentWillUnmount() {
    PopupManager.instance = null;
  }

  addModal(status: boolean, message?: string) {
    const id = Date.now() + Math.random();
    const newModals = [...this.state.modals, { id, status, message }];
    this.setState({ modals: newModals });
  }

  removeModal(id: number) {
    const newModals = this.state.modals.filter((m: any) => m.id !== id);
    this.setState({ modals: newModals });
  }

  render() {
    return (
      <div className="popup-manager">
        {this.state.modals.map((modal: any, index: number) => (
          <ConfirmationModal
            key={modal.id}
            isOpen={true}
            onClose={() => this.removeModal(modal.id)}
            isStatus={modal.status}
            message={modal.message}
            index={index}
          />
        ))}
      </div>
    );
  }
}

export default PopupManager;
