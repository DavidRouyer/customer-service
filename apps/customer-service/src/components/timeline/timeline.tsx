import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { cn } from '@cs/ui';

import {
  createScrollerLock,
  ScrollerLockContext,
} from '~/components/timeline/useScrollLock';
import { SizeObserver } from '~/components/timeline/useSizeObserver';

type TimelineProps = {
  haveNewest: boolean;
  haveOldest: boolean;
  id: string;
  items: string[];
  loadNewerEntries: (ticketId: string, entryId: string) => unknown;
  loadOlderEntries: (ticketId: string, entryId: string) => unknown;
  markEntryRead: (ticketId: string, entryId: string) => unknown;
  entryLoadingState?: boolean;
  renderItem: (props: {
    entryId: string;
    containerElementRef: React.RefObject<HTMLElement>;
    containerWidthBreakpoint: string;
    ticketId: string;
    nextEntryId?: string;
    previousEntryId?: string;
  }) => JSX.Element;
  setIsNearBottom: (ticketId: string, isNearBottom: boolean) => unknown;
  ticketId: string;
};

const AT_BOTTOM_THRESHOLD = 15;
const AT_BOTTOM_DETECTOR_STYLE = { height: AT_BOTTOM_THRESHOLD };
const LOAD_NEWER_THRESHOLD = 5;

export const Timeline: React.FC<TimelineProps> = ({
  haveNewest,
  haveOldest,
  id,
  items,
  loadNewerEntries,
  loadOlderEntries,
  markEntryRead,
  entryLoadingState,
  renderItem,
  setIsNearBottom,
  ticketId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const entriesRef = useRef<HTMLDivElement>(null);
  const atBottomDetectorRef = useRef<HTMLDivElement>(null);

  let intersectionObserver: IntersectionObserver | undefined = undefined;

  const [widthBreakpoint, setWidthBreakpoint] = useState('wide');
  const [scrollLocked, setScrollLocked] = useState(false);
  const [state, setState] = useState({
    oldestPartiallyVisibleEntryId: undefined as undefined | string,
    newestBottomVisibleEntryId: undefined as undefined | string,
  });

  const getEntryIdFromElement = (element: undefined | Element) => {
    return element instanceof HTMLElement ? element.dataset.entryId : undefined;
  };

  const updateIntersectionObserver = () => {
    const containerEl = containerRef.current;
    const entriesEl = entriesRef.current;
    const atBottomDetectorEl = atBottomDetectorRef.current;
    if (!containerEl || !entriesEl || !atBottomDetectorEl) {
      return;
    }

    intersectionObserver?.disconnect();

    const intersectionRatios = new Map<Element, number>();

    const intersectionObserverCallback: IntersectionObserverCallback = (
      entries
    ) => {
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

      let newestBottomVisible: undefined | Element;
      if (newestFullyVisible) {
        newestBottomVisible = newestFullyVisible;
      } else if (
        newIsNearBottom ||
        newestPartiallyVisible !== oldestPartiallyVisible
      ) {
        newestBottomVisible = oldestPartiallyVisible;
      }

      const oldestPartiallyVisibleEntryId = getEntryIdFromElement(
        oldestPartiallyVisible
      );
      const newestBottomVisibleEntryId =
        getEntryIdFromElement(newestBottomVisible);

      setState({
        oldestPartiallyVisibleEntryId: oldestPartiallyVisibleEntryId,
        newestBottomVisibleEntryId: newestBottomVisibleEntryId,
      });

      setIsNearBottom(ticketId, newIsNearBottom);

      if (newestBottomVisibleEntryId) {
        markNewestBottomVisibleEntryRead();

        const rowIndex = getRowIndexFromElement(newestBottomVisible);
        const maxRowIndex = items.length - 1;

        if (
          !entryLoadingState &&
          !haveNewest &&
          rowIndex !== undefined &&
          maxRowIndex >= 0 &&
          rowIndex >= maxRowIndex - LOAD_NEWER_THRESHOLD
        ) {
          loadNewerEntries(ticketId, newestBottomVisibleEntryId);
        }
      }

      if (
        !entryLoadingState &&
        !haveOldest &&
        oldestPartiallyVisibleEntryId &&
        oldestPartiallyVisibleEntryId === items[0]
      ) {
        loadOlderEntries(ticketId, oldestPartiallyVisibleEntryId);
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
    for (const child of entriesEl.children) {
      if ((child as HTMLElement).dataset.entryId) {
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
  const markNewestBottomVisibleEntryRead = (): void => {
    const { newestBottomVisibleEntryId: newestBottomVisibleMessageId } = state;
    if (newestBottomVisibleMessageId) {
      markEntryRead(id, newestBottomVisibleMessageId);
    }
  };
  const scrollerLock = createScrollerLock('Timeline', onScrollLockChange);

  const messageNodes: ReactNode[] = [];
  for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
    const previousItemIndex = itemIndex - 1;
    const nextItemIndex = itemIndex + 1;

    const previousEntryId: undefined | string = items[previousItemIndex];
    const nextEntryId: undefined | string = items[nextItemIndex];
    const entryId = items[itemIndex];

    console.log('entryId', entryId);

    messageNodes.push(
      <div
        key={entryId}
        className={
          itemIndex === items.length - 1
            ? 'module-timeline__last-message'
            : undefined
        }
        data-item-index={itemIndex}
        data-entry-id={entryId}
        role="listitem"
      >
        {renderItem({
          containerElementRef: containerRef,
          containerWidthBreakpoint: widthBreakpoint,
          ticketId: ticketId,
          entryId: entryId!,
          previousEntryId,
          nextEntryId,
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
                ref={entriesRef}
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

function getRowIndexFromElement(
  element: undefined | Element
): undefined | number {
  return element instanceof HTMLElement && element.dataset.itemIndex
    ? parseInt(element.dataset.itemIndex, 10)
    : undefined;
}
