import { FilterObject } from "../../models/Filter";

export interface FilterOptionProps {
  onToggleAll: () => void;
  isChecked: (value: string) => boolean;
  onChange: ({ value, checked }: { value: string; checked: boolean }) => void;
  values: string[];
}

export type CheckboxOptionsFilterKey = keyof Pick<
  FilterObject,
  "countries" | "difficulties" | "languages" | "types" | "ranges" | "providers"
>;
