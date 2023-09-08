/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
/*!
 * perfect-scrollbar v1.5.0
 * Copyright 2020 Hyunje Jun, MDBootstrap and Contributors
 * Licensed under MIT
 */

const get = (element: Element) => {
  return getComputedStyle(element);
};

const set = (
  element: HTMLElement,
  obj: Record<string, string | number | null | undefined>
) => {
  for (const key in obj) {
    let val = obj[key];
    if (typeof val === 'number') {
      val = val + 'px';
    }
    (element.style as unknown as Record<string, unknown>)[key] = val;
  }
  return element;
};

const div = (className: string) => {
  const div = document.createElement('div');
  div.className = className;
  return div;
};

const elMatches =
  typeof Element !== 'undefined' &&
  // || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector
  (Element.prototype.matches || Element.prototype.webkitMatchesSelector);

const matches = (element: Element, query: string) => {
  if (!elMatches) {
    throw new Error('No element matching method supported');
  }

  return elMatches.call(element, query);
};

const remove = (element: Element) => {
  if (element.remove) {
    element.remove();
  } else {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
};

const queryChildren = (element: Element, selector: string) => {
  return Array.from(element.children).filter(function (child) {
    return matches(child, selector);
  });
};

type Cls = {
  main: string;
  rtl: string;
  element: {
    thumb: (x: string) => string;
    rail: (x: string) => string;
    consuming: string;
  };
  state: {
    focus: string;
    clicking: string;
    active: (x: string) => string;
    scrolling: (x: string) => string;
  };
};

const cls: Cls = {
  main: 'ps',
  rtl: 'ps__rtl',
  element: {
    thumb: (x) => {
      return 'ps__thumb-' + x;
    },
    rail: (x) => {
      return 'ps__rail-' + x;
    },
    consuming: 'ps__child--consume',
  },
  state: {
    focus: 'ps--focus',
    clicking: 'ps--clicking',
    active: (x) => {
      return 'ps--active-' + x;
    },
    scrolling: (x) => {
      return 'ps--scrolling-' + x;
    },
  },
};

/*
 * Helper methods
 */
// TODO: remove initialization
const scrollingClassTimeout: Record<string, number | null> = {
  x: null,
  y: null,
};

function addScrollingClass(i: PerfectScrollbar, x: string) {
  const classList = i.element!.classList;
  const className = cls.state.scrolling(x);

  if (classList.contains(className)) {
    clearTimeout(scrollingClassTimeout[x]!);
  } else {
    classList.add(className);
  }
}

function removeScrollingClass(i: PerfectScrollbar, x: string) {
  scrollingClassTimeout[x] = window.setTimeout(function () {
    return i.isAlive && i.element!.classList.remove(cls.state.scrolling(x));
  }, i.settings.scrollingThreshold);
}

function setScrollingClassInstantly(i: PerfectScrollbar, x: string) {
  addScrollingClass(i, x);
  removeScrollingClass(i, x);
}

type EventElement = {
  element: Element;
  handlers: Record<string, ((evt: Event) => void)[]>;
  bind(
    eventName: string,
    handler: (evt: MouseEvent | TouchEvent) => void
  ): void;
  unbind(
    eventName: string,
    target?: (evt: MouseEvent | TouchEvent) => void
  ): void;
  unbindAll(): void;
  isEmpty: boolean;
};

const EventElement = function EventElement(
  this: EventElement,
  element: Element
) {
  this.element = element;
  this.handlers = {};
} as unknown as new (element: Element) => EventElement;

const prototypeAccessors: PropertyDescriptorMap = {
  isEmpty: { configurable: true },
};

EventElement.prototype.bind = function bind(
  this: EventElement,
  eventName: keyof GlobalEventHandlersEventMap,
  handler: (evt: Event) => void
) {
  if (typeof this.handlers[eventName] === 'undefined') {
    this.handlers[eventName] = [];
  }
  this.handlers[eventName]!.push(handler);

  const evts = ['touchstart', 'wheel', 'touchmove'];
  if (evts.indexOf(eventName) !== -1) {
    this.element.addEventListener(eventName, handler, { passive: false });
  } else {
    this.element.addEventListener(eventName, handler, false);
  }
};

EventElement.prototype.unbind = function unbind(
  this: EventElement,
  eventName: keyof GlobalEventHandlersEventMap,
  target?: (evt: Event) => void
) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const this$1 = this;

  this.handlers[eventName] = this.handlers[eventName]!.filter(
    function (handler) {
      if (target && handler !== target) {
        return true;
      }
      this$1.element.removeEventListener(eventName, handler, false);
      return false;
    }
  );
};

EventElement.prototype.unbindAll = function unbindAll(this: EventElement) {
  for (const name in this.handlers) {
    this.unbind(name);
  }
};

prototypeAccessors.isEmpty!.get = function (this: EventElement) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const this$1 = this;

  return Object.keys(this.handlers).every(function (key) {
    return this$1.handlers[key]!.length === 0;
  });
};

Object.defineProperties(EventElement.prototype, prototypeAccessors);

type EventManager = {
  eventElements: EventElement[];
  eventElement(element: Element): EventElement;
  bind(
    element: Document | Element,
    eventName: keyof GlobalEventHandlersEventMap,
    handler:
      | ((evt: MouseEvent) => void)
      | ((evt: TouchEvent) => void)
      | ((evt: WheelEvent) => void)
      | ((evt: KeyboardEvent) => void)
  ): void;
  unbind(
    element: Document | Element,
    eventName: keyof GlobalEventHandlersEventMap,
    handler: ((evt: MouseEvent) => void) | ((evt: TouchEvent) => void)
  ): void;
  unbindAll(): void;
  once(
    element: Document | Element,
    eventName: keyof GlobalEventHandlersEventMap,
    handler: (evt: MouseEvent | TouchEvent) => void
  ): void;
};

const EventManager = function EventManager(this: EventManager) {
  this.eventElements = [];
} as unknown as new () => EventManager;

EventManager.prototype.eventElement = function eventElement(
  this: EventManager,
  element: Element
) {
  let ee = this.eventElements.filter(function (ee) {
    return ee.element === element;
  })[0];
  if (!ee) {
    ee = new EventElement(element);
    this.eventElements.push(ee);
  }
  return ee;
};

EventManager.prototype.bind = function bind(
  this: EventManager,
  element: Element,
  eventName: keyof GlobalEventHandlersEventMap,
  handler: (evt: MouseEvent | TouchEvent) => void
) {
  this.eventElement(element).bind(eventName, handler);
};

EventManager.prototype.unbind = function unbind(
  this: EventManager,
  element: Element,
  eventName: keyof GlobalEventHandlersEventMap,
  handler: (evt: Event) => void
) {
  const ee = this.eventElement(element);
  ee.unbind(eventName, handler);

  if (ee.isEmpty) {
    // remove
    this.eventElements.splice(this.eventElements.indexOf(ee), 1);
  }
};

EventManager.prototype.unbindAll = function unbindAll(this: EventManager) {
  this.eventElements.forEach(function (e) {
    return e.unbindAll();
  });
  this.eventElements = [];
};

EventManager.prototype.once = function once(
  this: EventManager,
  element: Element,
  eventName: keyof GlobalEventHandlersEventMap,
  handler: (evt: MouseEvent | TouchEvent) => void
) {
  const ee = this.eventElement(element);
  const onceHandler = function (evt: MouseEvent | TouchEvent) {
    ee.unbind(eventName, onceHandler);
    handler(evt);
  };
  ee.bind(eventName, onceHandler);
};

const createEvent = (name: string) => {
  if (typeof window.CustomEvent === 'function') {
    return new CustomEvent(name);
  } else {
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(name, false, false, undefined);
    return evt;
  }
};

function processScrollDiff(
  i: PerfectScrollbar,
  axis: string,
  diff: number,
  useScrollingClass?: boolean,
  forceFireReachEvent?: boolean,
  disableOnYReachWhenNoScroll?: boolean
) {
  if (useScrollingClass === void 0) useScrollingClass = true;
  if (forceFireReachEvent === void 0) forceFireReachEvent = false;

  let fields: [
    'contentWidth' | 'contentHeight',
    'containerWidth' | 'containerHeight',
    'scrollLeft' | 'scrollTop',
    'x' | 'y',
    'left' | 'up',
    'right' | 'down',
  ];
  if (axis === 'top') {
    fields = [
      'contentHeight',
      'containerHeight',
      'scrollTop',
      'y',
      'up',
      'down',
    ];
  } else if (axis === 'left') {
    fields = [
      'contentWidth',
      'containerWidth',
      'scrollLeft',
      'x',
      'left',
      'right',
    ];
  } else {
    throw new Error('A proper axis should be provided');
  }

  processScrollDiff$1(
    i,
    diff,
    fields,
    useScrollingClass,
    forceFireReachEvent,
    disableOnYReachWhenNoScroll
  );
}

function processScrollDiff$1(
  i: PerfectScrollbar,
  diff: number,
  ref: [
    'contentWidth' | 'contentHeight',
    'containerWidth' | 'containerHeight',
    'scrollLeft' | 'scrollTop',
    'x' | 'y',
    'left' | 'up',
    'right' | 'down',
  ],
  useScrollingClass: boolean,
  forceFireReachEvent: boolean,
  disableOnYReachWhenNoScroll?: boolean
) {
  const contentHeight = ref[0];
  const containerHeight = ref[1];
  const scrollTop = ref[2];
  const y = ref[3];
  const up = ref[4];
  const down = ref[5];
  if (useScrollingClass === void 0) useScrollingClass = true;
  if (forceFireReachEvent === void 0) forceFireReachEvent = false;

  const element = i.element;

  // reset reach
  i.reach[y] = null;

  const eventFlag =
    disableOnYReachWhenNoScroll === true
      ? i[contentHeight] !== i[containerHeight]
      : true;

  // 1 for subpixel rounding
  if (eventFlag && element![scrollTop] < 1) {
    i.reach[y] = 'start';
  }

  // 1 for subpixel rounding
  if (
    eventFlag &&
    element![scrollTop] > i[contentHeight]! - i[containerHeight]! - 1
  ) {
    i.reach[y] = 'end';
  }

  if (diff) {
    element!.dispatchEvent(createEvent('ps-scroll-' + y));

    if (diff < 0) {
      element!.dispatchEvent(createEvent('ps-scroll-' + up));
    } else if (diff > 0) {
      element!.dispatchEvent(createEvent('ps-scroll-' + down));
    }

    if (useScrollingClass) {
      setScrollingClassInstantly(i, y);
    }
  }

  if (i.reach[y] && (diff || forceFireReachEvent)) {
    element!.dispatchEvent(createEvent('ps-' + y + '-reach-' + i.reach[y]));
  }
}

const toInt = (x: string) => {
  return parseInt(x, 10) || 0;
};

const isEditable = (el: Element) => {
  return (
    matches(el, 'input,[contenteditable]') ||
    matches(el, 'select,[contenteditable]') ||
    matches(el, 'textarea,[contenteditable]') ||
    matches(el, 'button,[contenteditable]')
  );
};

const outerWidth = (element: HTMLDivElement) => {
  const styles = get(element);
  return (
    toInt(styles.width) +
    toInt(styles.paddingLeft) +
    toInt(styles.paddingRight) +
    toInt(styles.borderLeftWidth) +
    toInt(styles.borderRightWidth)
  );
};

type Env = {
  isWebKit: boolean;
  supportsTouch: boolean;
  supportsIePointer: number;
  isChrome: boolean;
};

const env: Env = {
  isWebKit:
    typeof document !== 'undefined' &&
    'WebkitAppearance' in document.documentElement.style,
  supportsTouch:
    typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      ('maxTouchPoints' in window.navigator &&
        window.navigator.maxTouchPoints > 0)),
  //|| (window.DocumentTouch && document instanceof window.DocumentTouch)
  supportsIePointer: 0, //navigator?.msMaxTouchPoints,
  isChrome:
    typeof navigator !== 'undefined' && /Chrome/i.test(navigator?.userAgent),
};

function updateGeometry(i: PerfectScrollbar) {
  const element = i.element;
  const roundedScrollTop = Math.floor(element!.scrollTop);
  const rect = element!.getBoundingClientRect();

  i.containerWidth = Math.round(rect.width);
  i.containerHeight = Math.round(rect.height);
  i.contentWidth = element!.scrollWidth;
  i.contentHeight = element!.scrollHeight;

  if (!element!.contains(i.scrollbarXRail)) {
    // clean up and append
    queryChildren(element!, cls.element.rail('x')).forEach(function (el) {
      return remove(el);
    });
    element!.appendChild(i.scrollbarXRail!);
  }
  if (!element!.contains(i.scrollbarYRail)) {
    // clean up and append
    queryChildren(element!, cls.element.rail('y')).forEach(function (el) {
      return remove(el);
    });
    element!.appendChild(i.scrollbarYRail!);
  }

  if (
    !i.settings.suppressScrollX &&
    i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth
  ) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(
      i,
      toInt(((i.railXWidth * i.containerWidth) / i.contentWidth).toString())
    );
    i.scrollbarXLeft = toInt(
      (
        ((i.negativeScrollAdjustment + element!.scrollLeft) *
          (i.railXWidth - i.scrollbarXWidth)) /
        (i.contentWidth - i.containerWidth)
      ).toString()
    );
  } else {
    i.scrollbarXActive = false;
  }

  if (
    !i.settings.suppressScrollY &&
    i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight
  ) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(
      i,
      toInt(((i.railYHeight * i.containerHeight) / i.contentHeight).toString())
    );
    i.scrollbarYTop = toInt(
      (
        (roundedScrollTop * (i.railYHeight - i.scrollbarYHeight)) /
        (i.contentHeight - i.containerHeight)
      ).toString()
    );
  } else {
    i.scrollbarYActive = false;
  }

  if (i.scrollbarXLeft! >= i.railXWidth! - i.scrollbarXWidth!) {
    i.scrollbarXLeft = i.railXWidth! - i.scrollbarXWidth!;
  }
  if (i.scrollbarYTop! >= i.railYHeight! - i.scrollbarYHeight!) {
    i.scrollbarYTop = i.railYHeight! - i.scrollbarYHeight!;
  }

  updateCss(element!, i);

  if (i.scrollbarXActive) {
    element!.classList.add(cls.state.active('x'));
  } else {
    element!.classList.remove(cls.state.active('x'));
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    element!.scrollLeft = i.isRtl === true ? i.contentWidth : 0;
  }
  if (i.scrollbarYActive) {
    element!.classList.add(cls.state.active('y'));
  } else {
    element!.classList.remove(cls.state.active('y'));
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    element!.scrollTop = 0;
  }
}

function getThumbSize(i: PerfectScrollbar, thumbSize: number) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element: Element, i: PerfectScrollbar) {
  const xRailOffset: {
    width: number | null;
    left?: number;
    bottom?: number;
    top?: number;
    right?: number;
  } = {
    width: i.railXWidth,
  };
  const roundedScrollTop = Math.floor(element.scrollTop);

  if (i.isRtl) {
    xRailOffset.left =
      i.negativeScrollAdjustment +
      element.scrollLeft +
      i.containerWidth! -
      i.contentWidth!;
  } else {
    xRailOffset.left = element.scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - roundedScrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + roundedScrollTop;
  }
  set(i.scrollbarXRail!, xRailOffset);

  const yRailOffset: {
    width?: number;
    height: number | null;
    left?: number;
    bottom?: number;
    top?: number;
    right?: number;
  } = { top: roundedScrollTop, height: i.railYHeight };
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right =
        i.contentWidth! -
        (i.negativeScrollAdjustment + element.scrollLeft) -
        i.scrollbarYRight -
        i.scrollbarYOuterWidth! -
        9;
    } else {
      yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left =
        i.negativeScrollAdjustment +
        element.scrollLeft +
        i.containerWidth! * 2 -
        i.contentWidth! -
        i.scrollbarYLeft -
        i.scrollbarYOuterWidth!;
    } else {
      yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
    }
  }
  set(i.scrollbarYRail!, yRailOffset);

  set(i.scrollbarX!, {
    left: i.scrollbarXLeft!,
    width: i.scrollbarXWidth! - i.railBorderXWidth,
  });
  set(i.scrollbarY!, {
    top: i.scrollbarYTop!,
    height: i.scrollbarYHeight! - i.railBorderYWidth,
  });
}

function clickRail(i: PerfectScrollbar) {
  //const element = i.element;

  i.event.bind(i.scrollbarY!, 'mousedown', function (e: MouseEvent) {
    return e.stopPropagation();
  });
  i.event.bind(i.scrollbarYRail!, 'mousedown', function (e: MouseEvent) {
    const positionTop =
      e.pageY -
      window.pageYOffset -
      i.scrollbarYRail!.getBoundingClientRect().top;
    const direction = positionTop > i.scrollbarYTop! ? 1 : -1;

    i.element!.scrollTop += direction * i.containerHeight!;
    updateGeometry(i);

    e.stopPropagation();
  });

  i.event.bind(i.scrollbarX!, 'mousedown', function (e: MouseEvent) {
    return e.stopPropagation();
  });
  i.event.bind(i.scrollbarXRail!, 'mousedown', function (e: MouseEvent) {
    const positionLeft =
      e.pageX -
      window.pageXOffset -
      i.scrollbarXRail!.getBoundingClientRect().left;
    const direction = positionLeft > i.scrollbarXLeft! ? 1 : -1;

    i.element!.scrollLeft += direction * i.containerWidth!;
    updateGeometry(i);

    e.stopPropagation();
  });
}

function dragThumb(i: PerfectScrollbar) {
  bindMouseScrollHandler(i, [
    'containerWidth',
    'contentWidth',
    'pageX',
    'railXWidth',
    'scrollbarX',
    'scrollbarXWidth',
    'scrollLeft',
    'x',
    'scrollbarXRail',
  ]);
  bindMouseScrollHandler(i, [
    'containerHeight',
    'contentHeight',
    'pageY',
    'railYHeight',
    'scrollbarY',
    'scrollbarYHeight',
    'scrollTop',
    'y',
    'scrollbarYRail',
  ]);
}

function bindMouseScrollHandler(
  i: PerfectScrollbar,
  ref: [
    'containerWidth' | 'containerHeight',
    'contentWidth' | 'contentHeight',
    'pageX' | 'pageY',
    'railXWidth' | 'railYHeight',
    'scrollbarX' | 'scrollbarY',
    'scrollbarXWidth' | 'scrollbarYHeight',
    'scrollLeft' | 'scrollTop',
    'x' | 'y',
    'scrollbarXRail' | 'scrollbarYRail',
  ]
) {
  const containerHeight = ref[0];
  const contentHeight = ref[1];
  const pageY = ref[2];
  const railYHeight = ref[3];
  const scrollbarY = ref[4];
  const scrollbarYHeight = ref[5];
  const scrollTop = ref[6];
  const y = ref[7];
  const scrollbarYRail = ref[8];

  const element = i.element;

  let startingScrollTop: number | null = null;
  let startingMousePageY: number | null = null;
  let scrollBy: number | null = null;

  function mouseMoveHandler(e: MouseEvent) {
    moveHandler(e, e[pageY]);
  }

  function touchMoveHandler(e: TouchEvent) {
    moveHandler(e, e.touches?.[0]?.[pageY] ?? 0);
  }

  function moveHandler(e: MouseEvent | TouchEvent, pageY: number) {
    element![scrollTop] =
      startingScrollTop! + scrollBy! * (pageY - startingMousePageY!);
    addScrollingClass(i, y);
    updateGeometry(i);

    e.stopPropagation();
    e.preventDefault();
  }

  function mouseUpHandler() {
    removeScrollingClass(i, y);
    i[scrollbarYRail]!.classList.remove(cls.state.clicking);
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  }

  function bindMoves(
    e: MouseEvent | TouchEvent,
    pageY: number,
    touchMode?: boolean
  ) {
    startingScrollTop = element![scrollTop];
    startingMousePageY = pageY;
    scrollBy =
      (i[contentHeight]! - i[containerHeight]!) /
      (i[railYHeight]! - i[scrollbarYHeight]!);
    if (!touchMode) {
      i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
      i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);
      e.preventDefault();
    } else {
      i.event.bind(i.ownerDocument, 'touchmove', touchMoveHandler);
    }

    i[scrollbarYRail]!.classList.add(cls.state.clicking);

    e.stopPropagation();
  }

  i.event.bind(i[scrollbarY]!, 'mousedown', function (e: MouseEvent) {
    bindMoves(e, e[pageY]);
  });
  i.event.bind(i[scrollbarY]!, 'touchstart', function (e: TouchEvent) {
    bindMoves(e, e.touches?.[0]?.[pageY] ?? 0, true);
  });
}

function keyboard(i: PerfectScrollbar) {
  const element = i.element;

  const elementHovered = function () {
    return matches(element!, ':hover');
  };
  const scrollbarFocused = function () {
    return matches(i.scrollbarX!, ':focus') || matches(i.scrollbarY!, ':focus');
  };

  function shouldPreventDefault(deltaX: number, deltaY: number) {
    const scrollTop = Math.floor(element!.scrollTop);
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if (
        (scrollTop === 0 && deltaY > 0) ||
        (scrollTop >= i.contentHeight! - i.containerHeight! && deltaY < 0)
      ) {
        return !i.settings.wheelPropagation;
      }
    }

    const scrollLeft = element!.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if (
        (scrollLeft === 0 && deltaX < 0) ||
        (scrollLeft >= i.contentWidth! - i.containerWidth! && deltaX > 0)
      ) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  i.event.bind(i.ownerDocument, 'keydown', function (e: KeyboardEvent) {
    // e.isDefaultPrevented?.() ||
    if (e.defaultPrevented) {
      return;
    }

    if (!elementHovered() && !scrollbarFocused()) {
      return;
    }

    let activeElement = document.activeElement
      ? document.activeElement
      : i.ownerDocument.activeElement;
    if (activeElement) {
      if (activeElement.tagName === 'IFRAME') {
        activeElement =
          (activeElement as HTMLIFrameElement).contentDocument?.activeElement ??
          null;
      } else {
        // go deeper if element is a webcomponent
        while (activeElement?.shadowRoot) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
      }
      if (isEditable(activeElement!)) {
        return;
      }
    }

    let deltaX = 0;
    let deltaY = 0;

    switch (e.which) {
      case 37: // left
        if (e.metaKey) {
          deltaX = -i.contentWidth!;
        } else if (e.altKey) {
          deltaX = -i.containerWidth!;
        } else {
          deltaX = -30;
        }
        break;
      case 38: // up
        if (e.metaKey) {
          deltaY = i.contentHeight!;
        } else if (e.altKey) {
          deltaY = i.containerHeight!;
        } else {
          deltaY = 30;
        }
        break;
      case 39: // right
        if (e.metaKey) {
          deltaX = i.contentWidth!;
        } else if (e.altKey) {
          deltaX = i.containerWidth!;
        } else {
          deltaX = 30;
        }
        break;
      case 40: // down
        if (e.metaKey) {
          deltaY = -i.contentHeight!;
        } else if (e.altKey) {
          deltaY = -i.containerHeight!;
        } else {
          deltaY = -30;
        }
        break;
      case 32: // space bar
        if (e.shiftKey) {
          deltaY = i.containerHeight!;
        } else {
          deltaY = -i.containerHeight!;
        }
        break;
      case 33: // page up
        deltaY = i.containerHeight!;
        break;
      case 34: // page down
        deltaY = -i.containerHeight!;
        break;
      case 36: // home
        deltaY = i.contentHeight!;
        break;
      case 35: // end
        deltaY = -i.contentHeight!;
        break;
      default:
        return;
    }

    if (i.settings.suppressScrollX && deltaX !== 0) {
      return;
    }
    if (i.settings.suppressScrollY && deltaY !== 0) {
      return;
    }

    element!.scrollTop -= deltaY;

    element!.scrollLeft += deltaX;
    updateGeometry(i);

    if (shouldPreventDefault(deltaX, deltaY)) {
      e.preventDefault();
    }
  });
}

function wheel(i: PerfectScrollbar) {
  const element = i.element;

  function shouldPreventDefault(deltaX: number, deltaY: number) {
    const roundedScrollTop = Math.floor(element!.scrollTop);
    const isTop = element!.scrollTop === 0;
    const isBottom =
      roundedScrollTop + element!.offsetHeight === element!.scrollHeight;
    const isLeft = element!.scrollLeft === 0;
    const isRight =
      element!.scrollLeft + element!.offsetWidth === element!.scrollWidth;

    let hitsBound;

    // pick axis with primary direction
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      hitsBound = isTop || isBottom;
    } else {
      hitsBound = isLeft || isRight;
    }

    return hitsBound ? !i.settings.wheelPropagation : true;
  }

  function getDeltaFromEvent(e: WheelEvent) {
    let deltaX = e.deltaX;
    let deltaY = -1 * e.deltaY;

    if (typeof deltaX === 'undefined' || typeof deltaY === 'undefined') {
      // OS X Safari
      deltaX = (-1 * (e as unknown as { wheelDeltaX: number }).wheelDeltaX) / 6;
      deltaY = (e as unknown as { wheelDeltaY: number }).wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY /* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = (e as unknown as { wheelDelta: number }).wheelDelta;
    }

    if (e.shiftKey) {
      // reverse axis with shift key
      return [-deltaY, -deltaX];
    }
    return [deltaX, deltaY];
  }

  function shouldBeConsumedByChild(
    target: Element,
    deltaX: number,
    deltaY: number
  ) {
    // FIXME: this is a workaround for <select> issue in FF and IE #571
    if (!env.isWebKit && element!.querySelector('select:focus')) {
      return true;
    }

    if (!element!.contains(target)) {
      return false;
    }

    let cursor = target;

    while (cursor && cursor !== element) {
      if (cursor.classList.contains(cls.element.consuming)) {
        return true;
      }

      const style = get(cursor);

      // if deltaY && vertical scrollable
      if (deltaY && style.overflowY.match(/(scroll|auto)/)) {
        const maxScrollTop = cursor.scrollHeight - cursor.clientHeight;
        if (maxScrollTop > 0) {
          if (
            (cursor.scrollTop > 0 && deltaY < 0) ||
            (cursor.scrollTop < maxScrollTop && deltaY > 0)
          ) {
            return true;
          }
        }
      }
      // if deltaX && horizontal scrollable
      if (deltaX && style.overflowX.match(/(scroll|auto)/)) {
        const maxScrollLeft = cursor.scrollWidth - cursor.clientWidth;
        if (maxScrollLeft > 0) {
          if (
            (cursor.scrollLeft > 0 && deltaX < 0) ||
            (cursor.scrollLeft < maxScrollLeft && deltaX > 0)
          ) {
            return true;
          }
        }
      }

      cursor = cursor.parentNode as Element;
    }

    return false;
  }

  function mousewheelHandler(e: WheelEvent) {
    const ref = getDeltaFromEvent(e);
    const deltaX = ref[0];
    const deltaY = ref[1];

    if (
      shouldBeConsumedByChild(
        (e as unknown as { target: Element }).target,
        deltaX!,
        deltaY!
      )
    ) {
      return;
    }

    let shouldPrevent = false;
    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      element!.scrollTop -= deltaY! * i.settings.wheelSpeed;
      element!.scrollLeft += deltaX! * i.settings.wheelSpeed;
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        element!.scrollTop -= deltaY * i.settings.wheelSpeed;
      } else {
        element!.scrollTop += deltaX! * i.settings.wheelSpeed;
      }
      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        element!.scrollLeft += deltaX * i.settings.wheelSpeed;
      } else {
        element!.scrollLeft -= deltaY! * i.settings.wheelSpeed;
      }
      shouldPrevent = true;
    }

    updateGeometry(i);

    shouldPrevent = shouldPrevent || shouldPreventDefault(deltaX!, deltaY!);
    if (shouldPrevent && !e.ctrlKey) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== 'undefined') {
    i.event.bind(element!, 'wheel', mousewheelHandler);
  } /* else if (typeof window.onmousewheel !== 'undefined') {
    i.event.bind(element!, 'mousewheel', mousewheelHandler);
  } */
}

function touch(i: PerfectScrollbar) {
  if (!env.supportsTouch && !env.supportsIePointer) {
    return;
  }

  const element = i.element;

  function shouldPrevent(deltaX: number, deltaY: number) {
    const scrollTop = Math.floor(element!.scrollTop);
    const scrollLeft = Math.ceil(element!.scrollLeft);
    const magnitudeX = Math.abs(deltaX);
    const magnitudeY = Math.abs(deltaY);

    if (!i.settings.wheelPropagation) {
      return true;
    }

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page

      if (i.settings.suppressScrollY) {
        return false;
      }

      if (deltaY > 0) {
        return scrollTop !== 0;
      }

      if (deltaY < 0) {
        return scrollTop < i.contentHeight! - i.containerHeight!;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (i.settings.suppressScrollX) {
        return false;
      }
      if (deltaX > 0) {
        return scrollLeft !== 0;
      }

      if (deltaY < 0) {
        return scrollLeft < i.contentWidth! - i.containerWidth!;
      }
    }

    return true;
  }

  function applyTouchMove(differenceX: number, differenceY: number) {
    element!.scrollTop -= differenceY;

    element!.scrollLeft -= differenceX;

    updateGeometry(i);
  }

  let startOffset: { pageX?: number; pageY?: number } = {};
  let startTime = 0;
  const speed: { x?: number; y?: number } = {};
  let easingLoop: number | null = null;

  function getTouch(e: TouchEvent) {
    if (e.targetTouches) {
      return e.targetTouches[0];
    } else {
      // Maybe IE pointer
      return e;
    }
  }

  function shouldHandle(e: PointerEvent | TouchEvent) {
    if (
      (e as PointerEvent).pointerType &&
      (e as PointerEvent).pointerType === 'pen' &&
      (e as PointerEvent).buttons === 0
    ) {
      return false;
    }
    if (
      (e as TouchEvent).targetTouches &&
      (e as TouchEvent).targetTouches.length === 1
    ) {
      return true;
    }
    if (
      (e as PointerEvent).pointerType &&
      (e as PointerEvent).pointerType !== 'mouse'
      // && (e as PointerEvent).pointerType !== e.MSPOINTER_TYPE_MOUSE
    ) {
      return true;
    }
    return false;
  }

  function touchStart(e: TouchEvent) {
    if (!shouldHandle(e)) {
      return;
    }

    const touch = getTouch(e) as Touch;

    startOffset.pageX = touch.pageX;
    startOffset.pageY = touch.pageY;

    startTime = new Date().getTime();

    if (easingLoop !== null) {
      clearInterval(easingLoop);
    }
  }

  function shouldBeConsumedByChild(
    target: Element | null,
    deltaX: number,
    deltaY: number
  ) {
    if (!element!.contains(target)) {
      return false;
    }

    let cursor = target;

    while (cursor && cursor !== element) {
      if (cursor.classList.contains(cls.element.consuming)) {
        return true;
      }

      const style = get(cursor);

      // if deltaY && vertical scrollable
      if (deltaY && style.overflowY.match(/(scroll|auto)/)) {
        const maxScrollTop = cursor.scrollHeight - cursor.clientHeight;
        if (maxScrollTop > 0) {
          if (
            (cursor.scrollTop > 0 && deltaY < 0) ||
            (cursor.scrollTop < maxScrollTop && deltaY > 0)
          ) {
            return true;
          }
        }
      }
      // if deltaX && horizontal scrollable
      if (deltaX && style.overflowX.match(/(scroll|auto)/)) {
        const maxScrollLeft = cursor.scrollWidth - cursor.clientWidth;
        if (maxScrollLeft > 0) {
          if (
            (cursor.scrollLeft > 0 && deltaX < 0) ||
            (cursor.scrollLeft < maxScrollLeft && deltaX > 0)
          ) {
            return true;
          }
        }
      }

      cursor = cursor.parentNode as Element;
    }

    return false;
  }

  function touchMove(e: TouchEvent) {
    if (shouldHandle(e)) {
      const touch = getTouch(e) as Touch;

      const currentOffset = { pageX: touch.pageX, pageY: touch.pageY };

      const differenceX = currentOffset.pageX - startOffset.pageX!;
      const differenceY = currentOffset.pageY - startOffset.pageY!;

      if (
        shouldBeConsumedByChild(
          (e as unknown as { target: Element }).target,
          differenceX,
          differenceY
        )
      ) {
        return;
      }

      applyTouchMove(differenceX, differenceY);
      startOffset = currentOffset;

      const currentTime = new Date().getTime();

      const timeGap = currentTime - startTime;
      if (timeGap > 0) {
        speed.x = differenceX / timeGap;
        speed.y = differenceY / timeGap;
        startTime = currentTime;
      }

      //if (shouldPrevent(differenceX, differenceY)) {
      if (e.cancelable && shouldPrevent(differenceX, differenceY)) {
        e.preventDefault();
      }
    }
  }
  function touchEnd() {
    if (i.settings.swipeEasing) {
      clearInterval(easingLoop!);
      easingLoop = window.setInterval(function () {
        /* if (i.isInitialized) {
          clearInterval(easingLoop);
          return;
        } */

        if (!speed.x && !speed.y) {
          clearInterval(easingLoop!);
          return;
        }

        if (Math.abs(speed.x!) < 0.01 && Math.abs(speed.y!) < 0.01) {
          clearInterval(easingLoop!);
          return;
        }

        applyTouchMove(speed.x! * 30, speed.y! * 30);

        speed.x! *= 0.8;
        speed.y! *= 0.8;
      }, 10);
    }
  }

  if (env.supportsTouch) {
    i.event.bind(element!, 'touchstart', touchStart);
    i.event.bind(element!, 'touchmove', touchMove);
    i.event.bind(element!, 'touchend', touchEnd);
  } else if (env.supportsIePointer) {
    if (window.PointerEvent) {
      i.event.bind(element!, 'pointerdown', touchStart);
      i.event.bind(element!, 'pointermove', touchMove);
      i.event.bind(element!, 'pointerup', touchEnd);
    } /* else if (window.MSPointerEvent) {
      i.event.bind(element!, 'MSPointerDown', touchStart);
      i.event.bind(element!, 'MSPointerMove', touchMove);
      i.event.bind(element!, 'MSPointerUp', touchEnd);
    }*/
  }
}

const defaultSettings = function (): PerfectScrollbarOptions {
  return {
    handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
    maxScrollbarLength: null,
    minScrollbarLength: null,
    scrollingThreshold: 1000,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
    suppressScrollX: false,
    suppressScrollY: false,
    swipeEasing: true,
    useBothWheelAxes: false,
    wheelPropagation: true,
    wheelSpeed: 1,
  };
};

const handlers = {
  'click-rail': clickRail,
  'drag-thumb': dragThumb,
  keyboard: keyboard,
  wheel: wheel,
  touch: touch,
};

export type PerfectScrollbarOptions = {
  handlers: (keyof typeof handlers)[];
  maxScrollbarLength: number | null;
  minScrollbarLength: number | null;
  scrollingThreshold: number;
  scrollXMarginOffset: number;
  scrollYMarginOffset: number;
  suppressScrollX: boolean;
  suppressScrollY: boolean;
  swipeEasing: boolean;
  useBothWheelAxes: boolean;
  wheelPropagation: boolean;
  wheelSpeed: number;
};

type PerfectScrollbar = {
  element: HTMLElement | null;
  settings: PerfectScrollbarOptions;
  containerWidth: number | null;
  containerHeight: number | null;
  contentWidth: number | null;
  contentHeight: number | null;
  isRtl: boolean;
  isNegativeScroll: boolean;
  negativeScrollAdjustment: number;
  event: EventManager;
  scrollbarXRail: HTMLDivElement | null;
  scrollbarYRail: HTMLDivElement | null;
  scrollbarX: HTMLDivElement | null;
  scrollbarY: HTMLDivElement | null;
  ownerDocument: Document;
  scrollbarXActive: boolean | null;
  scrollbarYActive: boolean | null;
  isAlive: boolean;
  scrollbarXWidth: number | null;
  scrollbarXLeft: number | null;
  scrollbarXBottom: number;
  lastScrollTop: number;
  isScrollbarXUsingBottom: boolean;
  scrollbarXTop: number;
  scrollbarYHeight: number | null;
  scrollbarYTop: number | null;
  railBorderXWidth: number;
  railXMarginWidth: number;
  railXWidth: number | null;
  railXRatio: number | null;
  scrollbarYLeft: number;
  scrollbarYRight: number;
  isScrollbarYUsingRight: boolean;
  scrollbarYOuterWidth: number | null;
  railBorderYWidth: number;
  railYMarginHeight: number;
  lastScrollLeft: number;
  railYHeight: number | null;
  railYRatio: number | null;
  reach: Record<string, string | null>;
  removePsClasses: () => void;
  onScroll(): void;
  update(disableOnYReachWhenNoScroll?: boolean): void;
  destroy(): void;
};

const PerfectScrollbar = function PerfectScrollbar(
  this: PerfectScrollbar,
  elementOrSelector: HTMLElement | string,
  userSettings: Partial<PerfectScrollbarOptions> | undefined
) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const this$1 = this;
  if (userSettings === void 0) userSettings = {};

  let element: HTMLElement | null;
  if (typeof elementOrSelector === 'string') {
    element = document.querySelector(elementOrSelector);
  } else {
    element = elementOrSelector;
  }

  if (!element?.nodeName) {
    throw new Error('no element is specified to initialize PerfectScrollbar');
  }

  this.element = element;

  element.classList.add(cls.main);

  this.settings = defaultSettings();
  Object.assign(this.settings, userSettings);
  /*for (const key in userSettings) {
    const typedKey = key as keyof PerfectScrollbarOptions;
    this.settings[typedKey] = userSettings[typedKey];
  }*/

  this.containerWidth = null;
  this.containerHeight = null;
  this.contentWidth = null;
  this.contentHeight = null;

  const focus = () => {
    return element?.classList.add(cls.state.focus);
  };
  const blur = () => {
    return element?.classList.remove(cls.state.focus);
  };

  this.isRtl = get(element).direction === 'rtl';
  if (this.isRtl === true) {
    element.classList.add(cls.rtl);
  }
  this.isNegativeScroll = (function () {
    const originalScrollLeft = element.scrollLeft;
    let result = null;
    element.scrollLeft = -1;
    result = element.scrollLeft < 0;
    element.scrollLeft = originalScrollLeft;
    return result;
  })();
  this.negativeScrollAdjustment = this.isNegativeScroll
    ? element.scrollWidth - element.clientWidth
    : 0;
  this.event = new EventManager();
  this.ownerDocument = element.ownerDocument || document;

  this.scrollbarXRail = div(cls.element.rail('x'));
  element.appendChild(this.scrollbarXRail);
  this.scrollbarX = div(cls.element.thumb('x'));
  this.scrollbarXRail.appendChild(this.scrollbarX);
  this.scrollbarX.setAttribute('tabindex', '0');
  this.event.bind(this.scrollbarX, 'focus', focus);
  this.event.bind(this.scrollbarX, 'blur', blur);
  this.scrollbarXActive = null;
  this.scrollbarXWidth = null;
  this.scrollbarXLeft = null;
  const railXStyle = get(this.scrollbarXRail);
  this.scrollbarXBottom = parseInt(railXStyle.bottom, 10);
  if (isNaN(this.scrollbarXBottom)) {
    this.isScrollbarXUsingBottom = false;
    this.scrollbarXTop = toInt(railXStyle.top);
  } else {
    this.isScrollbarXUsingBottom = true;
  }
  this.railBorderXWidth =
    toInt(railXStyle.borderLeftWidth) + toInt(railXStyle.borderRightWidth);
  // Set rail to display:block to calculate margins
  set(this.scrollbarXRail, { display: 'block' });
  this.railXMarginWidth =
    toInt(railXStyle.marginLeft) + toInt(railXStyle.marginRight);
  set(this.scrollbarXRail, { display: '' });
  this.railXWidth = null;
  this.railXRatio = null;

  this.scrollbarYRail = div(cls.element.rail('y'));
  element.appendChild(this.scrollbarYRail);
  this.scrollbarY = div(cls.element.thumb('y'));
  this.scrollbarYRail.appendChild(this.scrollbarY);
  this.scrollbarY.setAttribute('tabindex', '0');
  this.event.bind(this.scrollbarY, 'focus', focus);
  this.event.bind(this.scrollbarY, 'blur', blur);
  this.scrollbarYActive = null;
  this.scrollbarYHeight = null;
  this.scrollbarYTop = null;
  const railYStyle = get(this.scrollbarYRail);
  this.scrollbarYRight = parseInt(railYStyle.right, 10);
  if (isNaN(this.scrollbarYRight)) {
    this.isScrollbarYUsingRight = false;
    this.scrollbarYLeft = toInt(railYStyle.left);
  } else {
    this.isScrollbarYUsingRight = true;
  }
  this.scrollbarYOuterWidth = this.isRtl ? outerWidth(this.scrollbarY) : null;
  this.railBorderYWidth =
    toInt(railYStyle.borderTopWidth) + toInt(railYStyle.borderBottomWidth);
  set(this.scrollbarYRail, { display: 'block' });
  this.railYMarginHeight =
    toInt(railYStyle.marginTop) + toInt(railYStyle.marginBottom);
  set(this.scrollbarYRail, { display: '' });
  this.railYHeight = null;
  this.railYRatio = null;

  this.reach = {
    x:
      element.scrollLeft <= 0
        ? 'start'
        : element.scrollLeft >= this.contentWidth! - this.containerWidth!
        ? 'end'
        : null,
    y:
      element.scrollTop <= 0
        ? 'start'
        : element.scrollTop >= this.contentHeight! - this.containerHeight!
        ? 'end'
        : null,
  };

  this.isAlive = true;

  this.settings.handlers.forEach(function (handlerName) {
    return handlers[handlerName](this$1);
  });

  this.lastScrollTop = Math.floor(element.scrollTop); // for onScroll only
  this.lastScrollLeft = element.scrollLeft; // for onScroll only
  this.event.bind(this.element, 'scroll', function () {
    return this$1.onScroll();
  });
  updateGeometry(this);
} as unknown as new (
  elementOrSelector: Element | string,
  userSettings: Partial<PerfectScrollbarOptions> | undefined
) => PerfectScrollbar;

PerfectScrollbar.prototype.update = function update(
  this: PerfectScrollbar,
  disableOnYReachWhenNoScroll?: boolean
) {
  if (!this.isAlive) {
    return;
  }

  // Recalcuate negative scrollLeft adjustment
  this.negativeScrollAdjustment = this.isNegativeScroll
    ? this.element!.scrollWidth - this.element!.clientWidth
    : 0;

  // Recalculate rail margins
  set(this.scrollbarXRail!, { display: 'block' });
  set(this.scrollbarYRail!, { display: 'block' });
  this.railXMarginWidth =
    toInt(get(this.scrollbarXRail!).marginLeft) +
    toInt(get(this.scrollbarXRail!).marginRight);
  this.railYMarginHeight =
    toInt(get(this.scrollbarYRail!).marginTop) +
    toInt(get(this.scrollbarYRail!).marginBottom);

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  set(this.scrollbarXRail!, { display: 'none' });
  set(this.scrollbarYRail!, { display: 'none' });

  updateGeometry(this);

  processScrollDiff(this, 'top', 0, false, true, disableOnYReachWhenNoScroll);
  processScrollDiff(this, 'left', 0, false, true, disableOnYReachWhenNoScroll);

  set(this.scrollbarXRail!, { display: '' });
  set(this.scrollbarYRail!, { display: '' });
};

PerfectScrollbar.prototype.onScroll = function onScroll(
  this: PerfectScrollbar
) {
  if (!this.isAlive) {
    return;
  }

  updateGeometry(this);
  processScrollDiff(this, 'top', this.element!.scrollTop - this.lastScrollTop);
  processScrollDiff(
    this,
    'left',
    this.element!.scrollLeft - this.lastScrollLeft
  );

  this.lastScrollTop = Math.floor(this.element!.scrollTop);
  this.lastScrollLeft = this.element!.scrollLeft;
};

PerfectScrollbar.prototype.destroy = function destroy(this: PerfectScrollbar) {
  if (!this.isAlive) {
    return;
  }

  this.event.unbindAll();
  remove(this.scrollbarX!);
  remove(this.scrollbarY!);
  remove(this.scrollbarXRail!);
  remove(this.scrollbarYRail!);
  this.removePsClasses();

  // unset elements
  this.element = null;
  this.scrollbarX = null;
  this.scrollbarY = null;
  this.scrollbarXRail = null;
  this.scrollbarYRail = null;

  this.isAlive = false;
};

PerfectScrollbar.prototype.removePsClasses = function removePsClasses(
  this: PerfectScrollbar
) {
  this.element!.className = this.element!.className.split(' ')
    .filter(function (name) {
      return !name.match(/^ps([-_].+|)$/);
    })
    .join(' ');
};

export default PerfectScrollbar;
