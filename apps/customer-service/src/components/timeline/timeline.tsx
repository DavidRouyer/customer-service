import React, { ReactChild, useEffect, useRef, useState } from 'react';

import { cn } from '@cs/ui';

import {
  createScrollerLock,
  ScrollerLockContext,
} from '~/components/timeline/useScrollLock';
import { SizeObserver } from '~/components/timeline/useSizeObserver';

type TimelineProps = {
  haveNewest: boolean;
  haveOldest: boolean;
  items: string[];
  messageLoadingState?: boolean;
  loadNewerMessages: (conversationId: string, messageId: string) => unknown;
  loadOlderMessages: (conversationId: string, messageId: string) => unknown;
  renderItem: (props: {
    messageId: string;
    containerElementRef: React.RefObject<HTMLElement>;
    containerWidthBreakpoint: string;
    ticketId: string;
  }) => JSX.Element;
  setIsNearBottom: (ticketId: string, isNearBottom: boolean) => unknown;
  ticketId: string;
};

const AT_BOTTOM_THRESHOLD = 15;
const AT_BOTTOM_DETECTOR_STYLE = { height: AT_BOTTOM_THRESHOLD };

export const Timeline: React.FC<TimelineProps> = ({
  haveNewest,
  haveOldest,
  items,
  loadNewerMessages,
  loadOlderMessages,
  messageLoadingState,
  ticketId,
  renderItem,
  setIsNearBottom,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const atBottomDetectorRef = useRef<HTMLDivElement>(null);

  let intersectionObserver: IntersectionObserver | undefined = undefined;

  const [widthBreakpoint, setWidthBreakpoint] = useState('wide');
  const [scrollLocked, setScrollLocked] = useState(false);
  const [state, setState] = useState({
    oldestPartiallyVisibleMessageId: undefined as undefined | string,
    newestBottomVisibleMessageId: undefined as undefined | string,
  });

  const getMessageIdFromElement = (element: undefined | Element) => {
    return element instanceof HTMLElement
      ? element.dataset.messageId
      : undefined;
  };

  const updateIntersectionObserver = () => {
    const containerEl = containerRef.current;
    const messagesEl = messagesRef.current;
    const atBottomDetectorEl = atBottomDetectorRef.current;
    if (!containerEl || !messagesEl || !atBottomDetectorEl) {
      return;
    }

    // We re-initialize the `IntersectionObserver`. We don't want stale references to old
    //   props, and we care about the order of `IntersectionObserverEntry`s. (We could do
    //   this another way, but this approach works.)
    intersectionObserver?.disconnect();

    const intersectionRatios = new Map<Element, number>();

    const intersectionObserverCallback: IntersectionObserverCallback = (
      entries
    ) => {
      // The first time this callback is called, we'll get entries in observation order
      //   (which should match DOM order). We don't want to delete anything from our map
      //   because we don't want the order to change at all.
      entries.forEach((entry) => {
        intersectionRatios.set(entry.target, entry.intersectionRatio);
      });

      let newIsNearBottom = false;
      let oldestPartiallyVisible: undefined | Element;
      let newestPartiallyVisible: undefined | Element;
      let newestFullyVisible: undefined | Element;

      for (const [element, intersectionRatio] of intersectionRatios) {
        if (intersectionRatio === 0) {
          continue;
        }

        // We use this "at bottom detector" for two reasons, both for performance. It's
        //   usually faster to use an `IntersectionObserver` instead of a scroll event,
        //   and we want to do that here.
        //
        // 1. We can determine whether we're near the bottom without `onScroll`
        // 2. We need this information when deciding whether the bottom of the last
        //    message is visible. We want to get an intersection observer event when the
        //    bottom of the container comes into view.
        if (element === atBottomDetectorEl) {
          newIsNearBottom = true;
        } else {
          oldestPartiallyVisible = oldestPartiallyVisible || element;
          newestPartiallyVisible = element;
          if (intersectionRatio === 1) {
            newestFullyVisible = element;
          }
        }
      }

      // If a message is fully visible, then you can see its bottom. If not, there's a
      //   very tall message around. We assume you can see the bottom of a message if
      //   (1) another message is partly visible right below it, or (2) you're near the
      //   bottom of the scrollable container.
      let newestBottomVisible: undefined | Element;
      if (newestFullyVisible) {
        newestBottomVisible = newestFullyVisible;
      } else if (
        newIsNearBottom ||
        newestPartiallyVisible !== oldestPartiallyVisible
      ) {
        newestBottomVisible = oldestPartiallyVisible;
      }

      const oldestPartiallyVisibleMessageId = getMessageIdFromElement(
        oldestPartiallyVisible
      );
      const newestBottomVisibleMessageId =
        getMessageIdFromElement(newestBottomVisible);

      setState({
        oldestPartiallyVisibleMessageId,
        newestBottomVisibleMessageId,
      });

      setIsNearBottom(ticketId, newIsNearBottom);

      if (newestBottomVisibleMessageId) {
        this.markNewestBottomVisibleMessageRead();

        const rowIndex = getRowIndexFromElement(newestBottomVisible);
        const maxRowIndex = items.length - 1;

        if (
          !messageLoadingState &&
          !haveNewest &&
          isNumber(rowIndex) &&
          maxRowIndex >= 0 &&
          rowIndex >= maxRowIndex - LOAD_NEWER_THRESHOLD
        ) {
          loadNewerMessages(ticketId, newestBottomVisibleMessageId);
        }
      }

      if (
        !messageLoadingState &&
        !haveOldest &&
        oldestPartiallyVisibleMessageId &&
        oldestPartiallyVisibleMessageId === items[0]
      ) {
        loadOlderMessages(ticketId, oldestPartiallyVisibleMessageId);
      }
    };

    intersectionObserver = new IntersectionObserver(
      (entries, observer) => {
        console.log(
          intersectionObserver === observer,
          'observer.disconnect() should prevent callbacks from firing'
        );

        // Observer was updated from under us
        if (intersectionObserver !== observer) {
          return;
        }

        intersectionObserverCallback(entries, observer);
      },
      {
        root: containerEl,
        threshold: [0, 1],
      }
    );
    for (const child of messagesEl.children) {
      if ((child as HTMLElement).dataset.messageId) {
        intersectionObserver.observe(child);
      }
    }
    intersectionObserver.observe(atBottomDetectorEl);
  };

  useEffect(() => {
    updateIntersectionObserver();
  }, []);

  const onScrollLockChange = (): void => {
    setScrollLocked(scrollerLock.isLocked());
  };
  const onScroll = (event: React.UIEvent<HTMLDivElement>): void => {
    if (event.isTrusted) {
      scrollerLock.onUserInterrupt('onScroll');
    }
  };
  const scrollerLock = createScrollerLock('Timeline', onScrollLockChange);

  const messageNodes: ReactChild[] = [];
  for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
    const previousItemIndex = itemIndex - 1;
    const nextItemIndex = itemIndex + 1;

    const previousMessageId: undefined | string = items[previousItemIndex];
    const nextMessageId: undefined | string = items[nextItemIndex];
    const messageId = items[itemIndex];

    console.log('messageId', messageId);

    messageNodes.push(
      <div
        key={messageId}
        className={
          itemIndex === items.length - 1
            ? 'module-timeline__last-message'
            : undefined
        }
        data-item-index={itemIndex}
        data-message-id={messageId}
        role="listitem"
      >
        {renderItem({
          containerElementRef: containerRef,
          containerWidthBreakpoint: widthBreakpoint,
          ticketId: ticketId,
          messageId: messageId!,
        })}
      </div>
    );
  }

  return (
    <ScrollerLockContext.Provider value={scrollerLock}>
      <SizeObserver
        onSizeChange={(size) => {
          console.log(size);
        }}
      >
        {(ref) => (
          <div
            className={cn(
              'module-timeline',
              `module-timeline--width-${widthBreakpoint}`,
              'flex h-full overflow-hidden'
            )}
            role="presentation"
            tabIndex={-1}
            ref={ref}
          >
            <div
              className="module-timeline__messages__container overflow-y-overlay flex-1 overflow-x-hidden"
              onScroll={onScroll}
              ref={containerRef}
            >
              <div
                className={cn(
                  'module-timeline__messages',
                  haveNewest && 'module-timeline__messages--have-newest',
                  haveOldest && 'module-timeline__messages--have-oldest',
                  scrollLocked && 'module-timeline__messages--scroll-locked'
                )}
                ref={messagesRef}
                role="list"
              >
                {messageNodes}

                <div
                  className="module-timeline__messages__at-bottom-detector"
                  ref={atBottomDetectorRef}
                  style={AT_BOTTOM_DETECTOR_STYLE}
                />
              </div>
            </div>
          </div>
        )}
      </SizeObserver>
    </ScrollerLockContext.Provider>
  );
};
