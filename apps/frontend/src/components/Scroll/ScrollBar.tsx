// https://github.com/goldenyz/react-perfect-scrollbar/
import React, { CSSProperties } from 'react';

import { PropTypes } from 'prop-types';

import PerfectScrollbar from './perfect-scrollbar.js';

const handlerNameByEvent = {
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

export type ScrollBarProps = {
  children: React.ReactNode;
  className: string;
  style: CSSProperties;
  options: PropTypes.object;
  containerRef: PropTypes.func;
  onScrollY: PropTypes.func;
  onScrollX: PropTypes.func;
  onScrollUp: PropTypes.func;
  onScrollDown: PropTypes.func;
  onScrollLeft: PropTypes.func;
  onScrollRight: PropTypes.func;
  onYReachStart: PropTypes.func;
  onYReachEnd: PropTypes.func;
  onXReachStart: PropTypes.func;
  onXReachEnd: PropTypes.func;
  onSync: PropTypes.func;
  component: keyof JSX.IntrinsicElements;
};

export default class ScrollBar extends React.Component<ScrollBarProps> {
  _handlerByEvent: Record<string, any>;
  _ps: PerfectScrollbar | null = null;
  _container: HTMLElement | null = null;

  constructor(props: ScrollBarProps) {
    super(props);

    this.handleRef = this.handleRef.bind(this);
    this._handlerByEvent = {};
  }

  componentDidMount() {
    this._ps = new PerfectScrollbar(this._container, this.props.options);
    // hook up events
    this._updateEventHook();
    this._updateClassName();
  }

  componentDidUpdate(prevProps: ScrollBarProps) {
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
        this._container.removeEventListener(key, value, false);
      }
    });
    this._handlerByEvent = {};
    this._ps.destroy();
    this._ps = null;
  }

  _updateEventHook(prevProps = {}) {
    // hook up events
    Object.keys(handlerNameByEvent).forEach((key) => {
      const callback = this.props[handlerNameByEvent[key]];
      const prevCallback = prevProps[handlerNameByEvent[key]];
      if (callback !== prevCallback) {
        if (prevCallback) {
          const prevHandler = this._handlerByEvent[key];
          this._container.removeEventListener(key, prevHandler, false);
          this._handlerByEvent[key] = null;
        }
        if (callback) {
          const handler = () => callback(this._container);
          this._container.addEventListener(key, handler, false);
          this._handlerByEvent[key] = handler;
        }
      }
    });
  }

  _updateClassName() {
    const { className } = this.props;

    const psClassNames = this._container.className
      .split(' ')
      .filter((name) => name.match(/^ps([-_].+|)$/))
      .join(' ');

    if (this._container) {
      this._container.className = `scrollbar-container${
        className ? ` ${className}` : ''
      }${psClassNames ? ` ${psClassNames}` : ''}`;
    }
  }

  updateScroll() {
    this.props.onSync(this._ps);
  }

  handleRef(ref) {
    this._container = ref;
    this.props.containerRef(ref);
  }

  render() {
    const {
      className,
      style,
      option,
      options,
      containerRef,
      onScrollY,
      onScrollX,
      onScrollUp,
      onScrollDown,
      onScrollLeft,
      onScrollRight,
      onYReachStart,
      onYReachEnd,
      onXReachStart,
      onXReachEnd,
      component,
      onSync,
      children,
      ...remainProps
    } = this.props;
    const Comp = component;

    return (
      <Comp style={style} ref={this.handleRef} {...remainProps}>
        {children}
      </Comp>
    );
  }
}

ScrollBar.defaultProps = {
  className: '',
  style: undefined,
  option: undefined,
  options: undefined,
  containerRef: () => {},
  onScrollY: undefined,
  onScrollX: undefined,
  onScrollUp: undefined,
  onScrollDown: undefined,
  onScrollLeft: undefined,
  onScrollRight: undefined,
  onYReachStart: undefined,
  onYReachEnd: undefined,
  onXReachStart: undefined,
  onXReachEnd: undefined,
  onSync: (ps: PerfectScrollbar) => ps.update(),
  component: 'div',
};
