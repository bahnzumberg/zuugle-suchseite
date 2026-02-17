import { useTranslation } from "react-i18next";
import FilterSection from "../FilterSection";
import { getCountryTranslationMap } from "../utils/translationMaps";
import { getTransformedFilterOptions } from "../utils";
import CheckboxList from "../CheckboxList";
import { FilterOptionProps } from "../types";

export default function CountryFilter({
  onToggleAll,
  isChecked,
  onChange,
  values,
}: FilterOptionProps) {
  const { t } = useTranslation();
  const translationMap = getCountryTranslationMap(t);
  const options = getTransformedFilterOptions({ list: values, translationMap });

  return (
    <FilterSection
      title={t("filter.countries")}
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
