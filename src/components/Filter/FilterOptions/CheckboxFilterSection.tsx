import FilterSection from "../FilterSection";
import CheckboxList from "../CheckboxList";

interface CheckboxFilterSectionProps {
  title: string;
  options: { value: string; label: string }[];
  isChecked: (value: string) => boolean;
  onChange: (params: { value: string; checked: boolean }) => void;
  defaultExpanded?: boolean;
}

export default function CheckboxFilterSection({
  title,
  options,
  isChecked,
  onChange,
  defaultExpanded = false,
}: CheckboxFilterSectionProps) {
  return (
    <FilterSection
      title={title}
      showSection={options.length > 0}
      defaultExpanded={defaultExpanded}
      isActive={options.some((o) => isChecked(o.value))}
    >
      <CheckboxList list={options} isChecked={isChecked} onChange={onChange} />
    </FilterSection>
  );
}
