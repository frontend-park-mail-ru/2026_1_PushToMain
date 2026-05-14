import Death13 from "@react/stands";
import "./InputEmail.scss";
import { AppStorage } from "../../App";

class InputEmail extends Death13.Component {
  tagsEl: HTMLElement | null = null;
  lastTapTime: number = 0;

  constructor(props: any) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.addEmail = this.addEmail.bind(this);
    this.removeEmail = this.removeEmail.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.handleTagsScroll = this.handleTagsScroll.bind(this);
    this.tagsEl = null;
  }
  state: any = {
    emails: this.props.emails || [AppStorage.email],
    invalidEmails: [],
    currentInput: "",
    error: "",
    editingIndex: null,
    editValue: "",
  };

  componentDidMount() {
    this.updateFadeState();
  }

  componentDidUpdate() {
    this.updateFadeState();
  }

  updateFadeState = () => {
    const el = this.tagsEl;
    if (!el) return;
    const overflowing = el.scrollWidth > el.clientWidth;
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth;
    const shouldShowFade = overflowing && !isAtEnd;

    if (shouldShowFade) {
      el.classList.add("has-overflow");
    } else {
      el.classList.remove("has-overflow");
    }
  };

  handleTagsScroll = () => {
    this.updateFadeState();
  };

  handleTagDoubleClick = (e: any) => {
    const span = e.currentTarget.querySelector("span");
    if (!span) return;
    span.contentEditable = "true";
    console.log(span.contentEditable);
    span.focus();
    const range = document.createRange();
    range.selectNodeContents(span);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  handleTagBlur = (e: any, index: number) => {
    const span = e.currentTarget;
    const newValue = span.textContent.trim();
    const oldValue = this.state.emails[index];

    // Immediately make non-editable
    span.contentEditable = "false";
    window.getSelection()?.removeAllRanges();

    if (!newValue || newValue === oldValue) {
      // Revert text visually
      span.textContent = oldValue;
      return;
    }

    if (!this.validateEmail(newValue)) {
      this.setState({ error: "Некорректный email адрес" });
      span.textContent = oldValue;
      return;
    }

    if (
      this.state.emails.some(
        (email: string, i: number) => i !== index && email === newValue,
      )
    ) {
      this.setState({ error: "Такой email уже добавлен" });
      span.textContent = oldValue;
      return;
    }

    // Commit the change
    const newEmails = [...this.state.emails];
    newEmails[index] = newValue;
    const invalidEmails = this.state.invalidEmails.filter(
      (e: string) => e !== oldValue,
    );
    this.setState({ emails: newEmails, invalidEmails, error: "" });
    this.props.onChange?.(newEmails, invalidEmails);
  };

  handleTagKeyDown = (e: any, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
    if (e.key === "Escape") {
      const span = e.currentTarget;
      // Revert, then blur (blur will see the original text)
      span.textContent = this.state.emails[index];
      span.blur();
    }
  };

  handleTagTouchEnd = (e: any) => {
    if (e.target.closest(".remove-email")) return;
    const now = Date.now();
    if (now - this.lastTapTime < 300) {
      e.preventDefault();
      this.handleTagDoubleClick(e);
    }
    this.lastTapTime = now;
  };

  validateEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._-]+@e-smail\.ru$/;
    return emailRegex.test(email);
  }

  addEmail(email: string) {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    if (!this.validateEmail(trimmedEmail)) {
      const newEmails = [...this.state.emails, trimmedEmail];
      const invalidEmails = [...this.state.invalidEmails, trimmedEmail];

      this.setState({
        emails: newEmails,
        invalidEmails: invalidEmails,
        currentInput: "",
        error: "Некорректный email адрес",
      });

      if (this.props.onChange) {
        this.props.onChange(this.state.emails, this.state.invalidEmails);
      }
      return;
    }

    if (this.state.emails.includes(trimmedEmail)) {
      this.setState({
        error: "Такой email уже добавлен",
      });
      return;
    }

    const newEmails = [...this.state.emails, trimmedEmail];

    this.setState({
      emails: newEmails,
      currentInput: "",
      error: "",
    });

    if (this.props.onChange) {
      this.props.onChange(this.state.emails, this.state.invalidEmails);
    }
  }

  handleInput(e: any) {
    const value = e.target.value;
    this.setState({
      currentInput: value,
      error: "",
    });
  }

  handleKeyDown(e: any) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.addEmail(this.state.currentInput);
    }
  }

  removeEmail(index: number) {
    const newEmails = [...this.state.emails];
    const removedEmail = newEmails[index];
    newEmails.splice(index, 1);

    const invalidEmails = this.state.invalidEmails.filter(
      (email: string) => email !== removedEmail,
    );

    this.setState({
      emails: newEmails,
      invalidEmails: invalidEmails,
      error: "",
    });

    if (this.props.onChange) {
      this.props.onChange(newEmails, this.state.invalidEmails);
    }
  }

  handleOnBlur() {
    if (this.state.currentInput.trim()) {
      this.addEmail(this.state.currentInput);
    }
  }

  render() {
    const { emails, currentInput, invalidEmails, editingIndex, editValue } =
      this.state;

    console.log(emails);

    return (
      <div className="input-container">
        <span className="input__title">{this.props.input_title}</span>
        <div className="input-form">
          <div
            className="tags-scrollable"
            ref={(el: any) => {
              this.tagsEl = el;
            }}
            onScroll={this.handleTagsScroll}
          >
            {emails.map((email: string, index: number) => {
              const isInvalid = invalidEmails.includes(email);
              return (
                <span
                  key={index}
                  className={isInvalid ? "email-tag__error" : "email-tag"}
                  onDoubleClick={(e: any) => this.handleTagDoubleClick(e)}
                  onTouchEnd={(e: any) => this.handleTagTouchEnd(e)}
                >
                  <span
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onBlur={(e: any) => this.handleTagBlur(e, index)}
                    onKeyDown={(e: any) => this.handleTagKeyDown(e, index)}
                  >
                    {email}
                  </span>
                  <button
                    type="button"
                    className="remove-email"
                    onClick={() => this.removeEmail(index)}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
          <input
            type="text"
            value={currentInput}
            onInput={this.handleInput}
            onBlur={this.handleOnBlur}
            onKeyDown={this.handleKeyDown}
            placeholder={this.props.placeholder}
            className="email-input"
          />
        </div>
      </div>
    );
  }
}

export default InputEmail;
