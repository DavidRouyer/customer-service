// https://github.com/goldenyz/react-perfect-scrollbar/
import React, { CSSProperties } from 'react';

import PerfectScrollbar, {
  PerfectScrollbarOptions,
} from './perfect-scrollbar';

type handlerEvent =
  | 'onScrollY'
  | 'onScrollX'
  | 'onScrollUp'
  | 'onScrollDown'
  | 'onScrollLeft'
  | 'onScrollRight'
  | 'onYReachStart'
  | 'onYReachEnd'
  | 'onXReachStart'
  | 'onXReachEnd';

const handlerNameByEvent: {
  'ps-scroll-y': handlerEvent;
  'ps-scroll-x': handlerEvent;
  'ps-scroll-up': handlerEvent;
  'ps-scroll-down': handlerEvent;
  'ps-scroll-left': handlerEvent;
  'ps-scroll-right': handlerEvent;
  'ps-y-reach-start': handlerEvent;
  'ps-y-reach-end': handlerEvent;
  'ps-x-reach-start': handlerEvent;
  'ps-x-reach-end': handlerEvent;
} = {
  'ps-scroll-y': 'onScrollY',
  'ps-scroll-x': 'onScrollX',
  'ps-scroll-up': 'onScrollUp',
  'ps-scroll-down': 'onScrollDown',
  'ps-scroll-left': 'onScrollLeft',
  'ps-scroll-right': 'onScrollRight',
  'ps-y-reach-start': 'onYReachStart',
  'ps-y-reach-end': 'onYReachEnd',
  'ps-x-reach-start': 'onXReachStart',
  'ps-x-reach-end': 'onXReachEnd',
};
Object.freeze(handlerNameByEvent);

export type ScrollbarProps = {
  children: React.ReactNode;
  className: string;
  style: CSSProperties;
  options: Partial<PerfectScrollbarOptions>;
  containerRef: (ref: HTMLDivElement) => void;
  onScrollY: (element: HTMLElement) => void;
  onScrollX: (element: HTMLElement) => void;
  onScrollUp: (element: HTMLElement) => void;
  onScrollDown: (element: HTMLElement) => void;
  onScrollLeft: (element: HTMLElement) => void;
  onScrollRight: (element: HTMLElement) => void;
  onYReachStart: (element: HTMLElement) => void;
  onYReachEnd: (element: HTMLElement) => void;
  onXReachStart: (element: HTMLElement) => void;
  onXReachEnd: (element: HTMLElement) => void;
  onSync: (ps: PerfectScrollbar) => void;
  component: React.ForwardRefExoticComponent<
    React.ComponentPropsWithRef<'div'>
  >;
};

export default class Scrollbar extends React.Component<ScrollbarProps> {
  static defaultProps: Partial<ScrollbarProps> = {
    className: '',
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    containerRef: () => {},
    onSync: (ps: PerfectScrollbar) => ps.update(),
    component: 'div' as unknown as React.ForwardRefExoticComponent<
      React.ComponentPropsWithRef<'div'>
    >,
  };

  _handlerByEvent: Record<string, EventListenerOrEventListenerObject | null>;
  _ps: PerfectScrollbar | null = null;
  _container: HTMLElement | null = null;

  constructor(props: ScrollbarProps) {
    super(props);

    this.handleRef = this.handleRef.bind(this);
    this._handlerByEvent = {};
  }

  componentDidMount() {
    this._ps = new PerfectScrollbar(this._container!, this.props.options);
    // hook up events
    this._updateEventHook();
    this._updateClassName();
  }

  componentDidUpdate(prevProps: ScrollbarProps) {
    this._updateEventHook(prevProps);

    this.updateScroll();

    if (prevProps.className !== this.props.className) {
      this._updateClassName();
    }
  }

  componentWillUnmount() {
    // unhook up evens
    Object.keys(this._handlerByEvent).forEach((key) => {
      const value = this._handlerByEvent[key];

      if (value) {
        this._container!.removeEventListener(key, value, false);
      }
    });
    this._handlerByEvent = {};
    this._ps?.destroy();
    this._ps = null;
  }

  _updateEventHook(prevProps: Partial<ScrollbarProps> = {}) {
    // hook up events
    Object.keys(handlerNameByEvent).forEach((key) => {
      const typedKey = key as keyof typeof handlerNameByEvent;
      const callback = this.props[handlerNameByEvent[typedKey]];
      const prevCallback = prevProps[handlerNameByEvent[typedKey]];
      if (callback !== prevCallback) {
        if (prevCallback) {
          const prevHandler = this._handlerByEvent[key];
          this._container!.removeEventListener(key, prevHandler!, false);
          this._handlerByEvent[key] = null;
        }
        if (callback) {
          const handler = () => callback(this._container!);
          this._container!.addEventListener(key, handler, false);
          this._handlerByEvent[key] = handler;
        }
      }
    });
  }

  _updateClassName() {
    const { className } = this.props;

    const psClassNames = this._container!.className.split(' ')
      .filter((name) => name.match(/^ps([-_].+|)$/))
      .join(' ');

    if (this._container) {
      this._container.className = `scrollbar-container${
        className ? ` ${className}` : ''
      }${psClassNames ? ` ${psClassNames}` : ''}`;
    }
  }

  updateScroll() {
    this.props.onSync(this._ps!);
  }

  handleRef(ref: HTMLDivElement) {
    this._container = ref;
    this.props.containerRef?.(ref);
  }

  render() {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      className,
      style,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      options,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      containerRef,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onScrollY,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onScrollX,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onScrollUp,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onScrollDown,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onScrollLeft,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onScrollRight,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onYReachStart,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onYReachEnd,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onXReachStart,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onXReachEnd,
      component,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onSync,
      children,
      ...remainProps
    } = this.props;
    const Comp = component;

    return (
      // eslint-disable-next-line @typescript-eslint/unbound-method
      <Comp style={style} ref={this.handleRef} {...remainProps}>
        {children}
      </Comp>
    );
  }
}
