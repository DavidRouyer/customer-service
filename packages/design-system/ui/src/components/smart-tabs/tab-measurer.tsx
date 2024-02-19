import type {ReactElement} from 'react';
import React, {memo, useEffect, useRef, useCallback} from 'react';
import { useComponentDidMount } from './use-component-did-mount';
import { useEventListener } from './use-event-listener';
import { TabsTrigger } from '../tabs/tabs';
import { TabMeasurements, TabProps } from './types';

export type TabMeasurerProps = {
  tabToFocus: number;
  siblingTabHasFocus: boolean;
  activator: ReactElement;
  selected: number;
  tabs: Omit<TabProps, 'onToggleModal' | 'onTogglePopover'>[];
  handleMeasurement(measurements: TabMeasurements): void;
}

export const TabMeasurer = memo(function TabMeasurer({
  selected,
  tabs,
  activator,
  tabToFocus,
  handleMeasurement: handleMeasurementProp,
}: TabMeasurerProps) {
  const containerNode = useRef<HTMLDivElement>(null);
  const animationFrame = useRef<number | null>(null);

  const handleMeasurement = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    animationFrame.current = requestAnimationFrame(() => {
      if (!containerNode.current) {
        return;
      }

      const containerWidth = containerNode.current.offsetWidth - 20 - 28;
      const hiddenTabNodes = containerNode.current.children;
      const hiddenTabNodesArray = Array.from(hiddenTabNodes);
      const hiddenTabWidths = hiddenTabNodesArray.map((node) => {
        const buttonWidth = Math.ceil(node.getBoundingClientRect().width);
        return buttonWidth + 4;
      });
      const disclosureWidth = hiddenTabWidths.pop() || 0;

      handleMeasurementProp({
        containerWidth,
        disclosureWidth,
        hiddenTabWidths,
      });
    });
  }, [handleMeasurementProp]);

  useEffect(() => {
    handleMeasurement();
  }, [handleMeasurement, tabs]);

  useComponentDidMount(() => {
    if (process.env.NODE_ENV === 'development') {
      setTimeout(handleMeasurement, 0);
    }
  });

  const tabsMarkup = tabs.map((tab, index) => {
    return (
      <TabsTrigger
        key={`$${tab.id}Hidden`}
        id={`${tab.id}Measurer`}
        value={`${tab.id}Measurer`}
      >
        {tab.content}
      </TabsTrigger>
    );
  });

  useEventListener('resize', handleMeasurement);

  return (
    <div className={"invisible h-0 flex-wrap items-stretch justify-start"} ref={containerNode}>
      {tabsMarkup}
      {activator}
    </div>
  );
});
