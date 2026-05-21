import Death13 from "@react/stands";
import Notification from "../Notification/Notification";

class NotificationManager extends Death13.Component {
  static instance: NotificationManager | null = null;

  static show(status: boolean, message?: string): void {
    if (NotificationManager.instance) {
      NotificationManager.instance.addModal(status, message);
    }
  }

  constructor(props: any) {
    super(props);
    NotificationManager.instance = this;
    this.state = { modals: [] };
  }

  componentWillUnmount() {
    NotificationManager.instance = null;
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
          <Notification
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

export default NotificationManager;
