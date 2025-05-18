export function isOverFlowingX(scrollableElement: HTMLElement): boolean {
  return scrollableElement.scrollWidth > scrollableElement.clientWidth;
}

export function isOverFlowingY(scrollableElement: HTMLElement): boolean {
  return scrollableElement.scrollHeight > scrollableElement.clientHeight;
}

export function isOverFlowing(scrollableElement: HTMLElement): boolean {
  return isOverFlowingX(scrollableElement) || isOverFlowingY(scrollableElement);
}


export function isAtScrollTop(scrollableElement: HTMLElement): boolean {
    return scrollableElement.scrollTop === 0;
}

export function isAtScrollBottom(scrollableElement: HTMLElement): boolean {
    const diff = (scrollableElement.scrollHeight - scrollableElement.clientHeight) - Math.trunc(scrollableElement.scrollTop);
    return diff >= 0 && diff <= 1;
}

export function isAtScrollLeft(scrollableElement: HTMLElement): boolean {
    return scrollableElement.scrollLeft === 0;
}

export function isAtScrollRight(scrollableElement: HTMLElement): boolean {
    const diff = (scrollableElement.scrollWidth - scrollableElement.clientWidth) - Math.trunc(scrollableElement.scrollLeft);
    return diff >= 0 && diff <= 1;
}
