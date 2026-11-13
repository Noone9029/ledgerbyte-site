export function hasHoverPointer(minimumWidth = 0) {
  return window.innerWidth >= minimumWidth && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
