import anime from "animejs";

export const fadeIn = (targets) => {
  return anime({
    targets,
    opacity: [0, 1],
    duration: 800,
    easing: "easeOutQuad",
  });
};

export const slideIn = (targets) => {
  return anime({
    targets,
    translateX: [-50, 0],
    opacity: [0, 1],
    duration: 1000,
    easing: "easeOutElastic(1, .8)",
  });
};

export const scaleIn = (targets) => {
  return anime({
    targets,
    scale: [0, 1],
    opacity: [0, 1],
    duration: 800,
    easing: "easeOutElastic(1, .8)",
  });
};

export const staggerIn = (targets) => {
  return anime({
    targets,
    translateY: [50, 0],
    opacity: [0, 1],
    duration: 800,
    delay: anime.stagger(100),
    easing: "easeOutQuad",
  });
};
