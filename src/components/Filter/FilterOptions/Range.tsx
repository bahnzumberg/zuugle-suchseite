import { useTranslation } from "react-i18next";
import FilterSection from "../FilterSection";
import CheckboxList from "../CheckboxList";
import { FilterOptionProps } from "../types";

export default function RangeFilter({
  onToggleAll,
  isChecked,
  onChange,
  values,
}: FilterOptionProps) {
  const { t } = useTranslation();
  const options = values.map((entry) => ({
    value: entry,
    label: entry,
  }));

  return (
    <FilterSection
      title={t("filter.regionen")}
      toggleLabel={t("filter.alle_an_abwaehlen")}
      onToggleAll={onToggleAll}
      showSection={!!values.length}
    >
      <CheckboxList
        list={options}
        isChecked={isChecked}
        onChange={({ checked, value }) => onChange({ value, checked })}
      />
    </FilterSection>
  );
}
