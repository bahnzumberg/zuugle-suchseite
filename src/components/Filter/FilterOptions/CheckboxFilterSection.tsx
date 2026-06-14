import FilterSection from "../FilterSection";
import CheckboxList from "../CheckboxList";
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const anyChecked = options.some((o) => isChecked(o.value));
  const allChecked = options.every((o) => isChecked(o.value));

  const handleToggleAll = () => {
    const checked = !allChecked;
    options.forEach((o) => onChange({ value: o.value, checked }));
  };

  return (
    <FilterSection
      title={title}
      showSection={options.length > 0}
      defaultExpanded={defaultExpanded}
      isActive={anyChecked}
      headerAction={
        <Link
          component="button"
          variant="caption"
          onClick={handleToggleAll}
          sx={{
            color: "primary.main",
            textDecoration: "none",
          }}
        >
          {t("filter.alle_an_abwaehlen")}
        </Link>
      }
    >
      <CheckboxList list={options} isChecked={isChecked} onChange={onChange} />
    </FilterSection>
  );
}
