'use client';

import { ReactNode, useRef, useState } from 'react';

import { TimelineItem } from '~/app/_components/timeline/timeline-item';
import {
  createScrollerLock,
  ScrollerLockContext,
} from '~/app/_components/timeline/use-scroll-lock';

export type TimelineProps = {
  items: readonly string[];
  ticketId: string;
};

const AT_BOTTOM_THRESHOLD = 15;

export const getScrollBottom = (
  el: Readonly<Pick<HTMLElement, 'clientHeight' | 'scrollHeight' | 'scrollTop'>>
): number => el.scrollHeight - el.scrollTop - el.clientHeight;

export function clearTimeoutIfNecessary(
  timeout: undefined | null | ReturnType<typeof setTimeout>
): void {
  if (timeout) {
    clearTimeout(timeout);
  }
}

export const Timeline = ({ items, ticketId }: TimelineProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({
    scrollLocked: false,
    hasRecentlyScrolled: true,
  });

  const onScrollLockChange = (): void => {
    setState((oldState) => ({
      ...oldState,
      scrollLocked: scrollerLock.isLocked(),
    }));
  };

  const scrollerLock = createScrollerLock('Timeline', onScrollLockChange);

  const itemNodes: Array<ReactNode> = [];
  for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
    const previousEntryIndex = itemIndex - 1;
    const nextEntryIndex = itemIndex + 1;

    const previousEntryId: undefined | string = items[previousEntryIndex];
    const nextEntryId: undefined | string = items[nextEntryIndex];
    const entryId = items[itemIndex];

    if (!entryId) {
      continue;
    }

    itemNodes.push(
      <div
        key={entryId}
        data-item-index={itemIndex}
        data-message-id={entryId}
        role="listitem"
      >
        <TimelineItem
          itemId={entryId}
          nextEntryId={nextEntryId}
          ticketId={ticketId}
        />
      </div>
    );
  }

  const getIsAtBottom = () => {
    const containerEl = containerRef.current;
    if (!containerEl) {
      return false;
    }
    const isScrolledNearBottom =
      getScrollBottom(containerEl) <= AT_BOTTOM_THRESHOLD;
    const hasScrollbars = containerEl.clientHeight < containerEl.scrollHeight;
    return isScrolledNearBottom || !hasScrollbars;
  };

  let hasRecentlyScrolledTimeout: NodeJS.Timeout | null = null;

  const onScroll = (event: React.UIEvent<HTMLDivElement>): void => {
    // When content is removed from the viewport, such as typing indicators leaving
    // or messages being edited smaller or deleted, scroll events are generated and
    // they are marked as user-generated (isTrusted === true). Actual user generated
    // scroll events with movement must scroll a nonbottom state at some point.
    const isAtBottom = getIsAtBottom();
    if (event.isTrusted && !isAtBottom) {
      scrollerLock.onUserInterrupt('onScroll');
    }

    // hasRecentlyScrolled is used to show the floating date header, which we only
    // want to show when scrolling through history or on conversation first open.
    // Checking bottom prevents new messages and typing from showing the header.
    if (!state.hasRecentlyScrolled && isAtBottom) {
      return;
    }

    setState((oldState) => {
      // `onScroll` is called frequently, so it's performance-sensitive. We try our best
      //   to return the same state from this updater because that won't cause a re-render.
      if (oldState.hasRecentlyScrolled) return oldState;
      return { ...oldState, hasRecentlyScrolled: true };
    });

    clearTimeoutIfNecessary(hasRecentlyScrolledTimeout);
    hasRecentlyScrolledTimeout = setTimeout(() => {
      setState((oldState) => ({ ...oldState, hasRecentlyScrolled: false }));
    }, 3000);
  };

  return (
    <ScrollerLockContext.Provider value={scrollerLock}>
      <div
        className="flex h-full overflow-hidden py-3"
        role="presentation"
        tabIndex={-1}
      >
        <div
          ref={containerRef}
          className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden"
          onScroll={onScroll}
        >
          <div
            role="list"
            className="relative flex flex-1 flex-col justify-end"
          >
            {itemNodes}
          </div>
        </div>
      </div>
    </ScrollerLockContext.Provider>
  );
};
