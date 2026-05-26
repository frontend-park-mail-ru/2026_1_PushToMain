import Death13 from "@react/stands";
import "./InputEmail.scss";
import { AppStorage } from "../../App";

class InputEmail extends Death13.Component {
  tagsEl: HTMLElement | null = null;
  lastClickTime: number = 0;
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
    invalidEmails:
      this.props.emails.filter((e: any) => !this.validateEmail(e)) || [],
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

  startEditing = (index: number) => {
    this.setState({
      editingIndex: index,
      editValue: this.state.emails[index],
    });
  };

  handleTagClick = (index: number) => {
    const now = Date.now();
    if (now - this.lastClickTime < 300) {
      this.startEditing(index);
    }
    this.lastClickTime = now;
  };

  cancelEdit = () => {
    this.setState({ editingIndex: null, editValue: "", error: "" });
  };

  commitEdit = () => {
    const { editingIndex, editValue, emails, invalidEmails } = this.state;
    if (editingIndex === null) return;

    const trimmed = editValue.trim();

    if (!trimmed || trimmed === emails[editingIndex]) {
      this.cancelEdit();
      return;
    }

    if (!this.validateEmail(trimmed)) {
      this.setState({
        error: "Некорректный email адрес",
        editingIndex: null,
        editValue: "",
      });
      return;
    }

    if (
      emails.some((e: string, i: number) => i !== editingIndex && e === trimmed)
    ) {
      this.setState({ error: "Такой email уже добавлен" });
      return;
    }

    const newEmails = [...emails];
    newEmails[editingIndex] = trimmed;
    const newInvalid = invalidEmails.filter(
      (e: string) => e !== emails[editingIndex],
    );

    this.setState({
      emails: newEmails,
      invalidEmails: newInvalid,
      editingIndex: null,
      editValue: "",
      error: "",
    });
    this.props.onChange?.(newEmails, newInvalid);
  };

  handleEditKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.commitEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      this.cancelEdit();
    }
  };

  validateEmail(email: string) {
    const emailRegex = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
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

  measureTextWidth(text: string, font: string): number {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    context.font = font;
    return context.measureText(text).width;
  }

  trimEmailToFit(
    email: string,
    maxWidth: number = 240,
    font: string = "16px system-ui, sans-serif",
  ): string {
    if (this.measureTextWidth(email, font) <= maxWidth) return email;

    const atIdx = email.lastIndexOf("@");
    if (atIdx <= 0) {
      let truncated = email;
      while (
        this.measureTextWidth(truncated + "...", font) > maxWidth &&
        truncated.length > 0
      ) {
        truncated = truncated.slice(0, -1);
      }
      return truncated + "...";
    }

    const localPart = email.substring(0, atIdx);
    const domain = email.substring(atIdx);

    if (this.measureTextWidth(domain, font) > maxWidth) {
      return email.substring(0, maxWidth / 8) + "...";
    }

    const remainingWidth =
      maxWidth -
      this.measureTextWidth(domain, font) -
      this.measureTextWidth("...", font);
    if (remainingWidth <= 0) return "..." + domain;

    let low = 0,
      high = localPart.length;
    let best = 0;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const candidate = localPart.substring(0, mid);
      if (this.measureTextWidth(candidate, font) <= remainingWidth) {
        best = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const trimmedLocal = localPart.substring(0, best);
    return trimmedLocal + "..." + domain;
  }

  render() {
    const { emails, currentInput, invalidEmails, editingIndex, editValue } =
      this.state;

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
              const isEditing = index === editingIndex;

              return (
                <span
                  key={index}
                  className={isInvalid ? "email-tag__error" : "email-tag"}
                  onClick={() => this.handleTagClick(index)}
                  onTouchEnd={(e: any) => {
                    if (e.target.closest(".remove-email")) return;
                    const now = Date.now();
                    if (now - this.lastTapTime < 300) {
                      e.preventDefault();
                      this.startEditing(index);
                    }
                    this.lastTapTime = now;
                  }}
                >
                  {isEditing ? (
                    <input
                      className="edit-input"
                      value={editValue}
                      onInput={(e: any) =>
                        this.setState({ editValue: e.target.value })
                      }
                      onBlur={this.commitEdit}
                      onKeyDown={this.handleEditKeyDown}
                      autoFocus
                    />
                  ) : (
                    [
                      <span className="email-text" key="text">
                        {this.trimEmailToFit(email)}
                      </span>,
                      <button
                        key="remove"
                        type="button"
                        className="remove-email"
                        onClick={() => this.removeEmail(index)}
                      >
                        ×
                      </button>,
                    ]
                  )}
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
