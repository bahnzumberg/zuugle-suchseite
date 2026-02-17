import { useTranslation } from "react-i18next";
import FilterSection from "../FilterSection";
import { getSportTypeTranslationMap } from "../utils/translationMaps";
import { getTransformedFilterOptions } from "../utils";
import CheckboxList from "../CheckboxList";
import { FilterOptionProps } from "../types";

export default function SportTypeFilter({
  onToggleAll,
  isChecked,
  onChange,
  values,
}: FilterOptionProps) {
  const { t } = useTranslation();
  const translationMap = getSportTypeTranslationMap(t);
  const options = getTransformedFilterOptions({ list: values, translationMap });

  return (
    <FilterSection
      title={t("main.sportart")}
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
