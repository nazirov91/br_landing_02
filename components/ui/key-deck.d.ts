import type { ComponentType, ReactNode } from "react";

export type KeyDeckPart = { label: string; detail?: string; icon?: ComponentType<{ className?: string; strokeWidth?: number; style?: object }> };

export type KeyDeckProps = {
  /** Up to six modules, drawn as keys in two rows. */
  keys: KeyDeckPart[];
  /** The rail the keys sit on. */
  foundation: KeyDeckPart;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (open: boolean) => void;
  mark?: ReactNode;
  className?: string;
  /** Extra classes for the list of parts shown under the deck on narrow layouts. */
  listClassName?: string;
};

declare const KeyDeck: (props: KeyDeckProps) => ReactNode;
export default KeyDeck;
