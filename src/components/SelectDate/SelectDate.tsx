import Death13 from "@react/stands";
import "./SelectDate.scss";

class SelectDate extends Death13.Component {
    render() {
        return (
            <div className="select-container">
                <select name="day" id="day"></select>
                <select name="month" id="month"></select>
                <select name="year" id="year"></select>
            </div>
        );
    }
}

export default SelectDate;
