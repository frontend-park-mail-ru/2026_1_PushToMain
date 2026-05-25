import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getAllEmails } from "../../api/ApiEmail";
import Death13 from "@react/stands";

class AllEmailsPage extends Death13.Component {
  render() {
    return Death13.createElement(BaseEmailPage, {
      currentView: "all-emails",
      fetchEmails: getAllEmails,
      emptyMessage: "Нет писем",
    });
  }
}

export default AllEmailsPage;
