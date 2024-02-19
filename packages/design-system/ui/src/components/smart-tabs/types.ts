export type TabProps = {
  /** The unique identifier for the Tab */
  id: string;
  /** The name of the Tab */
  content: string;
  value: string;
  /** Whether the Tab is disabled */
  disabled?: boolean;
  /** If the Tab is currently focused */
  focused?: boolean;
  /** If the Tab is selected */
  selected?: boolean;
  /** If the Tab is currently being measured */
  measuring?: boolean;
}

export type TabMeasurements = {
  containerWidth: number;
  disclosureWidth: number;
  hiddenTabWidths: number[];
}
