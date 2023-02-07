export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);

    this.dist = { finalPosition: 0, startX: 0, moviment: 0 };
  }

  transition(active) {
    this.slide.style.transition = active ? "transform .3s" : "";
  }

  moveSlide(distX) {
    this.dist.movimentPosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  updatePosition(clientX) {
    this.dist.moviment = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.moviment;
  }

  onStart(event) {
    let movetype;
    if (event.type === "mousedown") {
      event.preventDefault();
      this.dist.startX = event.clientX;
      movetype = "mousemove";
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      movetype = "touchmove";
    }

    this.wrapper.addEventListener(movetype, this.onMove);
    this.transition(false);
  }

  onMove(event) {
    const pointerPosition =
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;
    const position = this.updatePosition(pointerPosition);
    this.moveSlide(position);
  }

  onEnd(event) {
    const eventEnd = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.wrapper.removeEventListener(eventEnd, this.onMove);
    this.dist.finalPosition = this.dist.movimentPosition;
    this.transition(true);
    this.changeSlideEnd();
  }

  changeSlideEnd() {
    if (this.dist.moviment > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.moviment < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.actual);
    }
  }

  addSlideEvent() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  slidePosicion(slide) {
    const margem = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margem);
  }

  slideConfig() {
    this.slideArray = [...this.slide.children].map(element => {
      const position = this.slidePosicion(element);
      return { position, element };
    });
  }

  slideIndex(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      actual: index,
      next: index === last ? undefined : index + 1
    };
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slideIndex(index);
    this.dist.finalPosition = activeSlide.position;
  }

  activePrevSlide() {
    if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
  }

  activeNextSlide() {
    if (this.index.next !== undefined) this.changeSlide(this.index.next);
  }

  init() {
    this.bindEvents();
    this.addSlideEvent();
    this.slideConfig();

    return this;
  }
}
