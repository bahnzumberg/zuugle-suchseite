export interface FilterOptionProps {
  onToggleAll: () => void;
  isChecked: (value: string) => boolean;
  onChange: ({ value, checked }: { value: string; checked: boolean }) => void;
  values: string[];
}
