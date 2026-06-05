import Death13 from "@react/stands";
import "./HorizontalScroller.scss";

interface HorizontalScrollerProps {
  className?: string;
  style?: Record<string, string>;
  children?: any;
}

class HorizontalScroller extends Death13.Component {
  containerRef: HTMLDivElement | null = null;
  private targetScroll = 0;
  private currentScroll = 0;
  private velocity = 0;
  private rafId: number | null = null;
  private observer: ResizeObserver | null = null;

  constructor(props: HorizontalScrollerProps) {
    super(props);
  }

  updateFadeState() {
    const el = this.containerRef;
    if (!el) return;
    const overflowing = el.scrollWidth > el.clientWidth;
    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth;
    const showFade = overflowing && !isAtEnd;
    el.classList.toggle("has-overflow-fade", showFade);
  }

  private startLoop = () => {
    if (this.rafId !== null) return;

    const step = () => {
      const el = this.containerRef;
      if (!el) return;

      const diff = this.targetScroll - this.currentScroll;

      if (Math.abs(diff) < 0.3 && Math.abs(this.velocity) < 0.1) {
        this.currentScroll = this.targetScroll;
        el.scrollLeft = this.currentScroll;
        this.rafId = null;
        return;
      }

      this.currentScroll += diff * 0.2;
      this.velocity *= 0.5;
      this.currentScroll += this.velocity;

      const max = el.scrollWidth - el.clientWidth;
      this.currentScroll = Math.max(0, Math.min(max, this.currentScroll));
      this.targetScroll = this.currentScroll;

      el.scrollLeft = this.currentScroll;
      this.updateFadeState();

      this.rafId = requestAnimationFrame(step);
    };

    this.rafId = requestAnimationFrame(step);
  };

  private addDelta = (delta: number) => {
    const el = this.containerRef;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    this.targetScroll += delta;
    this.targetScroll = Math.max(0, Math.min(max, this.targetScroll));
    this.velocity += delta * 0.08;

    if (this.rafId === null) {
      this.startLoop();
    }
  };

  handleWheel = (event: WheelEvent) => {
    event.preventDefault();

    let rawDelta = event.deltaY + event.deltaX;
    if (event.deltaMode === 1) {
      rawDelta *= 16;
    }
    this.addDelta(rawDelta * 2);
  };

  private touchStartX = 0;

  handleTouchStart = (e: TouchEvent) => {
    this.touchStartX = e.touches[0].clientX;
    this.velocity = 0;
  };

  handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const dx = this.touchStartX - e.touches[0].clientX;
    this.touchStartX = e.touches[0].clientX;
    this.addDelta(dx);
  };

  componentDidMount() {
    if (this.containerRef) {
      this.containerRef.addEventListener("wheel", this.handleWheel, {
        passive: false,
      });
      this.containerRef.addEventListener("touchstart", this.handleTouchStart, {
        passive: false,
      });
      this.containerRef.addEventListener("touchmove", this.handleTouchMove, {
        passive: false,
      });

      this.observer = new ResizeObserver(() => {
        this.updateFadeState();
      });
      this.observer.observe(this.containerRef);

      // Initial fade check
      this.updateFadeState();
    }
  }

  componentWillUnmount() {
    if (this.containerRef) {
      this.containerRef.removeEventListener("wheel", this.handleWheel);
      this.containerRef.removeEventListener(
        "touchstart",
        this.handleTouchStart,
      );
      this.containerRef.removeEventListener("touchmove", this.handleTouchMove);
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }

  render() {
    const { className = "", style = {}, children } = this.props;

    return (
      <div
        className={`horizontal-scroller ${className}`}
        style={style}
        ref={(el: HTMLDivElement) => {
          this.containerRef = el;
        }}
      >
        {children}
      </div>
    );
  }
}

export default HorizontalScroller;
