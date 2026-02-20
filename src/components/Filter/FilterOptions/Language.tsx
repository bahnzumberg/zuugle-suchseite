import { useTranslation } from "react-i18next";
import FilterSection from "../FilterSection";
import {
  getLanguageTranslationMap,
  getTransformedFilterOptions,
} from "../utils";
import CheckboxList from "../CheckboxList";
import { FilterCheckBoxOptionProps } from "../types";

export default function LanguageFilter({
  onToggleAll,
  isChecked,
  onChange,
  values,
}: FilterCheckBoxOptionProps) {
  const { t } = useTranslation();
  const translationMap = getLanguageTranslationMap(t);
  const options = getTransformedFilterOptions({
    list: values,
    translationMap,
  }).filter((l) => !!l.value && !!l.label);

  return (
    <FilterSection
      title={t("filter.sprache")}
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
