import Death13 from "@react/stands";
import "./Select.scss";

class Select extends Death13.Component {
    constructor(props: any) {
        super(props);

        this.selectOption = this.selectOption.bind(this);
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        document.addEventListener("click", this.handleClickOutside);
    }

    state: any = {
        isOpen: false,
        selectedValue: this.props.value || "",
        selectedLabel: this.props.label || "",
    };

    monthsList: any = {
        1: 31, // Январь
        2: 28, // Февраль
        3: 31, // Март
        4: 30, // Апрель
        5: 31, // Май
        6: 30, // Июнь
        7: 31, // Июль
        8: 31, // Август
        9: 30, // Сентябрь
        10: 31, // Октябрь
        11: 30, // Ноябрь
        12: 31, // Декабрь
    };

    monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

    handleClickOutside() {
        this.setState({ isOpen: false });
    }

    toggleDropDown(e: any) {
        e.stopPropagation();
        this.setState({ isOpen: !this.state.isOpen });
    }

    selectOption(value: string, label: string, e: any) {
        e.stopPropagation();
        this.setState({ isOpen: false, selectedValue: value, selectedLabel: label });

        if (this.props.onChange) {
            this.props.onChange(value, label);
        }
    }

    getDaysInMonth(monthStr: string, year: number) {
        const month = parseInt(monthStr);
        if (!month) return 31;
        if (month === 2) {
            const isLeapYear = (year % 4 === 0 && year % 100 != 0) || year % 400 == 0;
            return isLeapYear ? 29 : 28;
        }

        return this.monthsList[month] || 31;
    }

    getOption() {
        const { name } = this.props;

        if (name === "day") {
            const selectedMonth = this.props.selectedMonth || "Январь";
            const selectedYear = this.props.selectedYear || new Date().getFullYear();
            const dayInMonth = this.getDaysInMonth(selectedMonth, selectedYear);
            return Array.from({ length: dayInMonth }, (_, i) => ({
                value: String(i + 1),
                label: String(i + 1),
            }));
        }

        if (name === "month") {
            return this.monthNames.map((month, i) => ({
                value: String(i + 1),
                label: month,
            }));
        }

        if (name === "year") {
            const currentYear = new Date().getFullYear();
            return Array.from({ length: 100 }, (_, i) => ({
                value: String(currentYear - i),
                label: String(currentYear - i),
            }));
        }

        return [];
    }

    render() {
        const { selectedLabel, isOpen } = this.state;
        const options = this.getOption();
        return (
            <div className="select" name={this.props.name} onClick={this.toggleDropDown}>
                <div className="select__value">{selectedLabel || this.props.placeholder}</div>
                <div className={`select__toggle ${isOpen ? "open" : ""}`}>
                    <img src="../../assets/svg/ArrowDown.svg" />
                </div>
                {isOpen && (
                    <div className="select__dropdown shadow">
                        {options.map((option: any) => (
                            <div
                                className="select__value"
                                key={option.value}
                                onClick={(e: any) => this.selectOption(option.value, option.label, e)}>
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default Select;
