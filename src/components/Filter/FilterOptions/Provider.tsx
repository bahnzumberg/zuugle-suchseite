import { useTranslation } from "react-i18next";
import FilterSection from "../FilterSection";
import CheckboxList from "../CheckboxList";
import { FilterOptionProps } from "../types";
import { Provider } from "../../../models/Filter";

interface ProviderFilterProps extends FilterOptionProps {
  fetchedProviders: Provider[];
}

export default function ProviderFilter({
  onToggleAll,
  isChecked,
  onChange,
  values,
  fetchedProviders,
}: ProviderFilterProps) {
  const { t } = useTranslation();
  const options = values.map((entry) => ({
    value: entry,
    label:
      fetchedProviders.find((p) => p.provider === entry)?.provider_name ?? "",
  }));

  return (
    <FilterSection
      title={t("filter.provider")}
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
