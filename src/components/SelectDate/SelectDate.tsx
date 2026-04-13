import Death13 from "@react/stands";
import "./SelectDate.scss";
import Select from "../Select/Select";

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

    handleDayChange(value: string) {
        this.setState({ day: value });
    }

    handleMonthChange(value: string) {
        this.setState({ month: value, day: "" });
    }

    handleYearChange(value: string) {
        this.setState({ year: value, day: "" });
    }

    render() {
        const { day, month, year } = this.state;
        return (
            <div className="select-date">
                <span>Дата рождения</span>
                <div className="select-container">
                    <Select
                        name="day"
                        value={day}
                        placeholder="День"
                        selectedMonth={month}
                        selectedYear={year}
                        onChange={this.handleDayChange}
                    />
                    <Select name="month" value={month} placeholder="Месяц" onChange={this.handleMonthChange} />
                    <Select name="year" value={year} placeholder="Год" onChange={this.handleYearChange} />
                </div>
            </div>
        );
    }
}

export default SelectDate;
