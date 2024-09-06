import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function hidden(elem: HTMLElement | HTMLElement[]) {
  if (Array.isArray(elem)) {
    elem.forEach((el) => gsap.set(el, { autoAlpha: 0 }));
  } else {
    gsap.set(elem, { autoAlpha: 0 });
  }
}

function animateX(
  elem: HTMLElement,
  direction1: number = 1,
  direction2: number = 1
) {
  const x = direction1 * direction2 * 100;
  elem.style.transform = "translateX(" + x + "px)";
  elem.style.opacity = "0";
  gsap.fromTo(
    elem,
    { x, autoAlpha: 0 },
    {
      x: 0,
      duration: 1.25,
      autoAlpha: 1,
      ease: "expo",
      overwrite: "auto",
    }
  );
}

function animateY(
  elem: HTMLElement,
  direction1: number = 1,
  direction2: number = 1
) {
  const y = direction1 * direction2 * 100;
  elem.style.transform = "translateY(" + y + "px)";
  elem.style.opacity = "0";
  gsap.fromTo(
    elem,
    { y, autoAlpha: 0 },
    {
      y: 0,
      duration: 1,
      autoAlpha: 1,
      ease: "expo",
      overwrite: "auto",
    }
  );
}

function animateL2R(elem: HTMLElement, direction: number = 1) {
  animateX(elem, -1, direction);
}
function animateR2L(elem: HTMLElement, direction: number = 1) {
  animateX(elem, 1, direction);
}

function animateT2B(elem: HTMLElement, direction: number = 1) {
  animateY(elem, -1, direction);
}
function animateB2T(elem: HTMLElement, direction: number = 1) {
  animateY(elem, 1, direction);
}

function animateTX(
  elems: HTMLElement[],
  direction1: number = 1,
  direction2: number = 1
) {
  const x = direction1 * direction2 * 100;
  const tl = gsap.timeline();
  elems.forEach((elem) => {
    elem.style.transform = "translateX(" + x + "px)";
    elem.style.opacity = "0";
    tl.fromTo(
      elem,
      { x, autoAlpha: 0 },
      {
        x: 0,
        duration: 0.4,
        autoAlpha: 1,
        ease: "expo",
        overwrite: "auto",
      },
      "<0.2"
    );
  });
  return tl.play();
}

function animateTY(
  elems: HTMLElement[],
  direction1: number = 1,
  direction2: number = 1
) {
  const y = direction1 * direction2 * 100;
  const tl = gsap.timeline();
  elems.forEach((elem) => {
    elem.style.transform = "translateY(" + y + "px)";
    elem.style.opacity = "0";
    tl.fromTo(
      elem,
      { y, autoAlpha: 0 },
      {
        y: 0,
        duration: 0.4,
        autoAlpha: 1,
        ease: "expo",
        overwrite: "auto",
      },
      "<0.2"
    );
  });
  return tl.play();
}

function animateTL2R(elems: HTMLElement[], direction: number = 1) {
  animateTX(elems, -1, direction);
}
function animateTR2L(elems: HTMLElement[], direction: number = 1) {
  animateTX(elems, 1, direction);
}

function animateTT2B(elems: HTMLElement[], direction: number = 1) {
  animateTY(elems, -1, direction);
}
function animateTB2T(elems: HTMLElement[], direction: number = 1) {
  animateTY(elems, 1, direction);
}

function buildScrollAnimate(
  query: string,
  animate: Function,
  isTimeLine: boolean = false
) {
  const els = gsap.utils.toArray(document.querySelectorAll(query)) as any;
  const runAnimate = function (elem: HTMLElement | HTMLElement[]) {
    hidden(elem);
    ScrollTrigger.create({
      trigger: elem,
      scrub: true, // 是否需要绑定滚动条和动画执行关系
      onEnter: function () {
        animate(elem);
      },
      onEnterBack: function () {
        animate(elem, -1);
      },
      onLeave: function () {
        hidden(elem);
      },
    });
  };
  if (isTimeLine) {
    runAnimate(els);
  } else {
    els.forEach(runAnimate);
  }
}

export function useAnimate() {
  return {
    gsap,
    hidden,
    animateB2T,
    animateL2R,
    animateR2L,
    animateT2B,
    animateTL2R,
    animateTR2L,
    animateTT2B,
    animateTB2T,
    buildScrollAnimate,
  };
}
