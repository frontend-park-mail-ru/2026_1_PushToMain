import Death13 from "@react/stands";
import "./SelectDate.scss";
import Select from "../Select/Select";
import { AppStorage } from "../../App";

class SelectDate extends Death13.Component {
    constructor(props: any) {
        super(props);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.handleMonthChange = this.handleMonthChange.bind(this);
        this.handleYearChange = this.handleYearChange.bind(this);
    }
    state: any = {
        day: "",
        month: "",
        year: "",
    };

    getDay() {
        return this.state.day || this.props.birthDay || "";
    }

    getMonth() {
        return this.state.month || this.props.birthMonth || "";
    }

    getYear() {
        return this.state.year || this.props.birthYear || "";
    }

    handleDayChange(value: string) {
        this.setState({ day: value });
        if (this.props.onChange) {
            this.props.onChange({
                day: value,
                month: this.getMonth(),
                year: this.getYear(),
            });
        }
    }

    handleMonthChange(value: string) {
        this.setState({ month: value, day: "" });
        if (this.props.onChange) {
            this.props.onChange({
                day: "",
                month: value,
                year: this.getYear(),
            });
        }
    }

    handleYearChange(value: string) {
        this.setState({ year: value, day: "" });
        if (this.props.onChange) {
            this.props.onChange({
                day: "",
                month: this.getMonth(),
                year: value,
            });
        }
    }

    t(key: string): string {
        return AppStorage.t(key);
    }

    render() {
        const day = this.getDay();
        const month = this.getMonth();
        const year = this.getYear();
        return (
            <div className="select-date">
                <span>{this.t("date_of_birth")}</span>
                <div className="select-container">
                    <Select
                        name="day"
                        value={day}
                        placeholder={this.t("day")}
                        selectedMonth={month}
                        selectedYear={year}
                        onChange={this.handleDayChange}
                    />
                    <Select name="month" value={month} placeholder={this.t("month")} onChange={this.handleMonthChange} />
                    <Select name="year" value={year} placeholder={this.t("year")} onChange={this.handleYearChange} />
                </div>
            </div>
        );
    }
}

export default SelectDate;
