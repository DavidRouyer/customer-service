import React, { forwardRef, useImperativeHandle, useRef } from 'react';

import Scrollbar from '@/components/Scroll/Scrollar';
import { cn } from '@/lib/utils';

import '@/components/Scroll/perfect-scrollbar.css';

type MessageListInnerSnapshot = {
  sticky: boolean;
  clientHeight: number;
  scrollHeight: number;
  lastMessageOrGroup: {
    lastElement: Element | null;
    lastMessageInGroup: Element | null | undefined;
  };
  diff: number;
};

class MessageListInner extends React.Component<ScrollableMessageListProps> {
  scrollPointRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  scrollRef: React.RefObject<Scrollbar>;
  lastClientHeight: number;
  preventScrollTop: boolean;
  resizeObserver: ResizeObserver | undefined;
  scrollTicking: boolean;
  resizeTicking: boolean;
  noScroll: boolean | undefined;

  static defaultProps: Partial<ScrollableMessageListProps> = {
    loading: false,
    loadingMore: false,
    loadingMorePosition: 'top',
    disableOnYReachWhenNoScroll: false,
    autoScrollToBottom: true,
    autoScrollToBottomOnMount: true,
    scrollBehavior: 'auto',
  };

  constructor(props: ScrollableMessageListProps) {
    super(props);

    this.scrollPointRef = React.createRef();
    this.containerRef = React.createRef();
    this.scrollRef = React.createRef();
    this.lastClientHeight = 0;
    this.preventScrollTop = false;
    this.resizeObserver = undefined;
    this.scrollTicking = false;
    this.resizeTicking = false;
    this.noScroll = undefined;
  }

  getSnapshotBeforeUpdate(): MessageListInnerSnapshot {
    const list = this.containerRef.current!;

    const topHeight = Math.round(list.scrollTop + list.clientHeight);
    // 1 px fix for firefox
    const sticky =
      list.scrollHeight === topHeight ||
      list.scrollHeight + 1 === topHeight ||
      list.scrollHeight - 1 === topHeight;

    return {
      sticky,
      clientHeight: list.clientHeight,
      scrollHeight: list.scrollHeight,
      lastMessageOrGroup: this.getLastMessageOrGroup(),
      diff: list.scrollHeight - list.scrollTop,
    };
  }

  handleResize = () => {
    // If container is smaller than before resize - scroll to End
    if (this.containerRef.current!.clientHeight < this.lastClientHeight) {
      this.scrollToEnd(this.props.scrollBehavior);
    }

    this.scrollRef.current!.updateScroll();
  };

  handleContainerResize = () => {
    if (this.resizeTicking === false) {
      window.requestAnimationFrame(() => {
        const list = this.containerRef.current;

        if (list) {
          const currentHeight = list.clientHeight;

          const diff = currentHeight - this.lastClientHeight;

          if (diff >= 1) {
            // Because fractional

            if (this.preventScrollTop === false) {
              list.scrollTop = Math.round(list.scrollTop) - diff;
            }
          } else {
            list.scrollTop = list.scrollTop - diff;
          }

          this.lastClientHeight = list.clientHeight;

          this.scrollRef.current!.updateScroll();
        }

        this.resizeTicking = false;
      });

      this.resizeTicking = true;
    }
  };

  isSticked = () => {
    const list = this.containerRef.current!;

    return list.scrollHeight === Math.round(list.scrollTop + list.clientHeight);
  };

  handleScroll = () => {
    if (this.scrollTicking === false) {
      window.requestAnimationFrame(() => {
        if (this.noScroll === false) {
          this.preventScrollTop = this.isSticked();
        } else {
          this.noScroll = false;
        }

        this.scrollTicking = false;
      });

      this.scrollTicking = true;
    }
  };

  componentDidMount() {
    // Set scrollbar to bottom on start (getSnaphotBeforeUpdate is not invoked on mount)
    if (this.props.autoScrollToBottomOnMount === true) {
      this.scrollToEnd(this.props.scrollBehavior);
    }

    this.lastClientHeight = this.containerRef.current!.clientHeight;

    window.addEventListener('resize', this.handleResize);

    if (typeof window.ResizeObserver === 'function') {
      this.resizeObserver = new ResizeObserver(this.handleContainerResize);
      this.resizeObserver.observe(this.containerRef.current!);
    }
    this.containerRef.current?.addEventListener('scroll', this.handleScroll);
  }

  componentDidUpdate(
    prevProps: ScrollableMessageListProps,
    prevState: ScrollableMessageListProps,
    snapshot: MessageListInnerSnapshot
  ) {
    const {
      props: { autoScrollToBottom },
    } = this;

    if (typeof snapshot !== 'undefined') {
      const list = this.containerRef.current!;

      const { lastElement, lastMessageInGroup } = this.getLastMessageOrGroup();

      if (lastElement === snapshot.lastMessageOrGroup.lastElement) {
        // If lastMessageInGroup is defined last element is MessageGroup otherwise its Message
        if (
          typeof lastMessageInGroup === 'undefined' ||
          lastMessageInGroup === snapshot.lastMessageOrGroup.lastMessageInGroup
        ) {
          list.scrollTop =
            list.scrollHeight -
            snapshot.diff +
            (this.lastClientHeight - list.clientHeight);
        }
      }

      if (snapshot.sticky === true) {
        if (autoScrollToBottom === true) {
          this.scrollToEnd(this.props.scrollBehavior);
        }
        this.preventScrollTop = true;
      } else {
        if (snapshot.clientHeight < this.lastClientHeight) {
          // If was sticky because scrollHeight is not changing, so here will be equal to lastHeight plus current scrollTop
          // 1px fix id for firefox
          const sHeight = list.scrollTop + this.lastClientHeight;
          if (
            list.scrollHeight === sHeight ||
            list.scrollHeight + 1 === sHeight ||
            list.scrollHeight - 1 === sHeight
          ) {
            if (autoScrollToBottom === true) {
              this.scrollToEnd(this.props.scrollBehavior);
              this.preventScrollTop = true;
            }
          } else {
            this.preventScrollTop = false;
          }
        } else {
          this.preventScrollTop = false;

          if (lastElement === snapshot.lastMessageOrGroup.lastElement) {
            if (
              typeof lastMessageInGroup === 'undefined' ||
              lastMessageInGroup ===
                snapshot.lastMessageOrGroup.lastMessageInGroup
            ) {
              // New elements were not added at end
              // New elements were added at start
              if (
                list.scrollTop === 0 &&
                list.scrollHeight > snapshot.scrollHeight
              ) {
                list.scrollTop = list.scrollHeight - snapshot.scrollHeight;
              }
            }
          }
        }
      }

      this.lastClientHeight = snapshot.clientHeight;
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    if (typeof this.resizeObserver !== 'undefined') {
      this.resizeObserver.disconnect();
    }
    this.containerRef.current?.removeEventListener('scroll', this.handleScroll);
  }

  scrollToEnd(scrollBehavior = this.props.scrollBehavior) {
    const list = this.containerRef.current!;
    const scrollPoint = this.scrollPointRef.current!;

    // https://stackoverflow.com/a/45411081/6316091
    const parentRect = list.getBoundingClientRect();
    const childRect = scrollPoint.getBoundingClientRect();

    // Scroll by offset relative to parent
    const scrollOffset = childRect.top + list.scrollTop - parentRect.top;

    if (list.scrollBy) {
      list.scrollBy({ top: scrollOffset, behavior: scrollBehavior });
    } else {
      list.scrollTop = scrollOffset;
    }

    this.lastClientHeight = list.clientHeight;

    // Important flag! Blocks strange Chrome mobile behaviour - automatic scroll.
    // Chrome mobile sometimes trigger scroll when new content is entered to MessageInput. It's probably Chrome Bug - sth related with overflow-anchor
    this.noScroll = true;
  }

  getLastMessageOrGroup = () => {
    const lastElement = this.containerRef.current!.querySelector(
      '[data-message-list]>[data-message]:last-of-type,[data-message-list]>[data-message-group]:last-of-type'
    );

    const lastMessageInGroup = lastElement?.querySelector(
      '[data-message]:last-of-type'
    );

    return {
      lastElement,
      lastMessageInGroup,
    };
  };

  render() {
    const {
      props: {
        children,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        loading,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        loadingMore,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        loadingMorePosition,
        onYReachStart,
        onYReachEnd,
        className,
        disableOnYReachWhenNoScroll,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        scrollBehavior, // Just to remove rest
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        autoScrollToBottom, // Just to remove rest
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        autoScrollToBottomOnMount, // Just to remove rest
        ...rest
      },
    } = this;

    const cName = 'message-list';

    return (
      <div {...rest} className={cn(cName, className)}>
        <Scrollbar
          onYReachStart={onYReachStart}
          onYReachEnd={onYReachEnd}
          onSync={(ps) => ps.update(disableOnYReachWhenNoScroll)}
          className={`${cName}__scroll-wrapper px-3`}
          ref={this.scrollRef}
          containerRef={(ref) =>
            ((
              this.containerRef as unknown as { current: HTMLDivElement }
            ).current = ref)
          }
          options={{ suppressScrollX: true }}
          {...{ ['data-message-list']: '' }}
          style={{
            overscrollBehaviorY: 'none',
            overflowAnchor: 'auto',
            touchAction: 'none',
          }}
        >
          {children}
          <div
            className={`${cName}__scroll-to`}
            ref={this.scrollPointRef}
          ></div>
        </Scrollbar>
      </div>
    );
  }
}

type ScrollableMessageListRef = {
  scrollToBottom: (scrollBehavior: ScrollBehavior) => void;
} | null;

const ScrollableMessageList = forwardRef<
  ScrollableMessageListRef,
  React.ComponentPropsWithoutRef<typeof MessageListInner>
>((props, ref) => {
  const msgListRef = useRef<MessageListInner>(null);

  const scrollToBottom = (scrollBehavior: ScrollBehavior) =>
    msgListRef.current!.scrollToEnd(scrollBehavior);

  // Return object with public Api
  useImperativeHandle(ref, () => ({
    scrollToBottom,
  }));

  return <MessageListInner ref={msgListRef} {...props} />;
});

ScrollableMessageList.displayName = 'ScrollableMessageList';

type ScrollableMessageListProps = {
  children: React.ReactNode;

  /** Loading flag. */
  loading?: boolean;

  /** Loading more flag for infinity scroll. */
  loadingMore?: boolean;

  /** Loading more loader position. */
  loadingMorePosition?: 'top' | 'bottom';

  /**
   * This is fired when the scrollbar reaches the beginning on the y axis.<br/>
   * It can be used to load previous messages using the infinite scroll.
   */
  onYReachStart?: (element: HTMLElement) => void;

  /**
   * This is fired when the scrollbar reaches the end on the y axis.<br/>
   * It can be used to load next messages using the infinite scroll.
   */
  onYReachEnd?: (element: HTMLElement) => void;

  /**
   * Disables onYReachStart and onYReachEnd events from being fired<br />
   * when the list is not scrollable.
   * This is set to false by default for backward compatibility.
   */
  disableOnYReachWhenNoScroll?: boolean;

  /**
   * Auto scroll to bottom
   */
  autoScrollToBottom?: boolean;

  /**
   * Auto scroll to bottom on mount
   */
  autoScrollToBottomOnMount?: boolean;

  /**
   * Scroll behavior
   * https://developer.mozilla.org/en-US/docs/Web/API/ScrollToOptions/behavior
   */
  scrollBehavior?: ScrollBehavior;

  /** Additional classes. */
  className: string;
};

export { ScrollableMessageList };
