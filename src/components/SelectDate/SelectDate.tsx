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

  private daysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
  }

  private isValidDay(day: number, month: number, year: number): boolean {
    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    const max = this.daysInMonth(month, year);
    return day >= 1 && day <= max;
  }

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
    const newMonth = value;
    const currentYear = this.getYear();
    const currentDay = this.getDay();

    let newDay = currentDay;
    if (currentDay && newMonth && currentYear) {
      const dayNum = parseInt(currentDay, 10);
      const monthNum = parseInt(newMonth, 10);
      const yearNum = parseInt(currentYear, 10);
      if (!this.isValidDay(dayNum, monthNum, yearNum)) {
        newDay = "";
      }
    }
    this.setState({ month: newMonth, day: newDay });
    if (this.props.onChange) {
      this.props.onChange({
        day: newDay,
        month: newMonth,
        year: currentYear,
      });
    }
  }

  handleYearChange(value: string) {
    const newYear = value;
    const currentMonth = this.getMonth();
    const currentDay = this.getDay();

    let newDay = currentDay;
    if (currentDay && currentMonth && newYear) {
      const dayNum = parseInt(currentDay, 10);
      const monthNum = parseInt(currentMonth, 10);
      const yearNum = parseInt(newYear, 10);
      if (!this.isValidDay(dayNum, monthNum, yearNum)) {
        newDay = "";
      }
    }

    this.setState({ year: newYear, day: newDay });
    if (this.props.onChange) {
      this.props.onChange({
        day: newDay,
        month: currentMonth,
        year: newYear,
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
          <Select
            name="month"
            value={month}
            placeholder={this.t("month")}
            onChange={this.handleMonthChange}
          />
          <Select
            name="year"
            value={year}
            placeholder={this.t("year")}
            onChange={this.handleYearChange}
          />
        </div>
      </div>
    );
  }
}

export default SelectDate;
