'use client';

import { FC, useCallback, useReducer } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs/tabs';
import { TabMeasurer } from './tab-measurer';
import { TabMeasurements, TabProps } from './types';
import { getVisibleAndHiddenTabIndices } from './get-visible-and-hidden-tab-indices';
import { Button } from '../button/button';
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from '../../utils/cn';

export type SmartTabsProps = {
  onValueChange: (value: string) => void;
  selected: number;
  tabs: TabProps[];
  value?: string;
};

export type TabsState = {
  disclosureWidth: number;
  tabWidths: number[];
  visibleTabs: number[];
  hiddenTabs: number[];
  containerWidth: number;
  showDisclosure: boolean;
  tabToFocus: number;
  isTabPopoverOpen: boolean;
  isTabModalOpen: boolean;
  isNewViewModalActive: boolean;
  modalSubmitted: boolean;
  isTabsFocused: boolean;
}

export const SmartTabs: FC<SmartTabsProps> = ({
  onValueChange,
  selected,
  tabs,
  value,
}: SmartTabsProps) => {

  const [state, setState] = useReducer(
    (data: TabsState, partialData: Partial<TabsState>): TabsState => {
      return {...data, ...partialData};
    },
    {
      disclosureWidth: 0,
      containerWidth: Infinity,
      tabWidths: [],
      visibleTabs: [],
      hiddenTabs: [],
      showDisclosure: false,
      tabToFocus: -1,
      isNewViewModalActive: false,
      modalSubmitted: false,
      isTabsFocused: false,
      isTabPopoverOpen: false,
      isTabModalOpen: false,
    },
  );

  const {
    tabToFocus,
    visibleTabs,
    hiddenTabs,
    showDisclosure,
    isNewViewModalActive,
    modalSubmitted,
    disclosureWidth,
    tabWidths,
    containerWidth,
    isTabsFocused,
    isTabModalOpen,
    isTabPopoverOpen,
  } = state;

  const handleMeasurement = useCallback(
    (measurements: TabMeasurements) => {
      const {
        hiddenTabWidths: tabWidths,
        containerWidth,
        disclosureWidth,
      } = measurements;

      const {visibleTabs, hiddenTabs} = getVisibleAndHiddenTabIndices(
        tabs,
        selected,
        disclosureWidth,
        tabWidths,
        containerWidth,
      );
      setState({
        visibleTabs,
        hiddenTabs,
        disclosureWidth,
        containerWidth,
        tabWidths,
      });
    },
    [tabs, selected, setState],
  );

  const activator = <Button type='button' className='flex whitespace-nowrap'>More views</Button>;

  const disclosureActivatorVisible =
  visibleTabs.length < tabs.length

  const tabMeasurer = (
    <TabMeasurer
      tabToFocus={tabToFocus}
      activator={activator}
      selected={selected}
      tabs={tabs}
      siblingTabHasFocus={tabToFocus > -1}
      handleMeasurement={handleMeasurement}
    />
  );

  const renderTabMarkup = useCallback(
    (tab: TabProps, index: number) => {
      return (
        <TabsTrigger
          {...tab}
          key={`${index}-${tab.id}`}
          id={tab.id}
          value={tab.value}
          className={cn('flex whitespace-nowrap', {
            "flex-auto": disclosureActivatorVisible
          })}>{tab.content}</TabsTrigger>
      );
    },
    [
      tabs,
      selected,
      tabToFocus,
      disclosureActivatorVisible
    ],
  );

  const tabsMarkup = visibleTabs
    .sort((tabA, tabB) => tabA - tabB)
    .filter((tabIndex) => tabs[tabIndex])
    .map((tabIndex) => renderTabMarkup(tabs[tabIndex]!, tabIndex));

  return <Tabs value={value} onValueChange={onValueChange}>
      <TabsPrimitive.List>{tabMeasurer}</TabsPrimitive.List>
      <div className='flex flex-wrap justify-start items-stretch'>
        <TabsList>
          {tabsMarkup}
          {disclosureActivatorVisible ? activator : null}
        </TabsList>
      </div>
      <TabsContent value="a">Make changes to your account here.</TabsContent>
      <TabsContent value="b">Change your password here.</TabsContent>
    </Tabs>;
};