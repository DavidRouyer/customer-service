'use client';

import { FC, useCallback, useReducer, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs/tabs';
import { TabMeasurer } from './tab-measurer';
import { TabMeasurements, TabProps } from './types';
import { getVisibleAndHiddenTabIndices } from './get-visible-and-hidden-tab-indices';
import { Button } from '../button/button';
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from '../../utils/cn';

export type SmartTabsProps = {
  selected: number;
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
  selected
}: SmartTabsProps) => {

  const [tabs] = useState([
    {
      id: 'a',
      value: 'a',
      content: 'All customers',
    },
    {
      id: 'b',
      value: 'b',
      content: 'Accepts marketing',
    },
    {
      id: 'c',
      value: 'c',
      content: 'Repeat customers',
    },
    {
      id: 'd',
      value: 'd',
      content: 'Prospects',
    },
    {
      id: 'e',
      value: 'e',
      content: 'France',
    },
    {
      id: 'f',
      value: 'f',
      content: 'Allemagne',
    },
    {
      id: 'g',
      value: 'g',
      content: 'Etats-Unis',
    },
    {
      id: 'h',
      value: 'h',
      content: 'Guinée-Bissau',
    },
    {
      id: 'i',
      value: 'i',
      content: 'Corée du Nord',
    },
    {
      id: 'j',
      value: 'j',
      content: 'Corée du Sud',
    },
    {
      id: 'k',
      value: 'k',
      content: 'Japon',
    },
    {
      id: 'l',
      value: 'l',
      content: 'Chine',
    },
    {
      id: 'm',
      value: 'm',
      content: 'Hong-Kong',
    },
  ]);

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
      console.log('handleMeasurement', tabWidths, containerWidth, disclosureWidth);

      const {visibleTabs, hiddenTabs} = getVisibleAndHiddenTabIndices(
        tabs,
        selected,
        disclosureWidth,
        tabWidths,
        containerWidth,
      );
      console.log('handleMeasurement', visibleTabs, hiddenTabs);
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
          })}
        >{tab.content}</TabsTrigger>
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
    .map((tabIndex) => renderTabMarkup(tabs[tabIndex], tabIndex));

  return <Tabs defaultValue="account">
      <TabsPrimitive.List>{tabMeasurer}</TabsPrimitive.List>
      <div className='flex flex-wrap justify-start items-stretch'>
        <TabsList>
          {tabsMarkup}
          {visibleTabs.length > 0 ? activator : null}
        </TabsList>
      </div>
      <TabsContent value="account">Make changes to your account here.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>;
};