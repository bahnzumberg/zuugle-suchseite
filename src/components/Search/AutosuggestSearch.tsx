import React, { useState } from "react";
import { loadSuggestions } from "../../actions/crudActions";
import CustomSelect from "./CustomSelect";
import { getTLD } from "../../utils/globals";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { RootState } from "../..";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../hooks";
import { searchPhraseUpdated } from "../../features/searchSlice";
import { useTranslation } from "react-i18next";
import { theme } from "../../theme";

export interface AutosuggestSearchProps {
  showSearchModal: boolean;
  setShowSearchModal: (value: boolean) => void;
  onSearchSuggestion: (value: string) => void;
}

const AutosuggestSearch = ({
  showSearchModal,
  setShowSearchModal,
  onSearchSuggestion,
}: AutosuggestSearchProps) => {
  const { t } = useTranslation();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const city = useSelector((state: RootState) => state.search.city);
  const searchPhrase = useSelector(
    (state: RootState) => state.search.searchPhrase,
  );
  const language = useSelector((state: RootState) => state.search.language);
  const dispatch = useAppDispatch();

  const handleSelect = (phrase: string) => {
    const value = phrase ? phrase : searchPhrase ? searchPhrase : "";
    onSearchSuggestion(value);
  };

  //What the component should do while I type in values
  const handleInputChange = (inputValue: string) => {
    let _city = "";
    const tld = getTLD();

    if (city === null) {
      _city = "";
    } else {
      _city = city.value;
    }

    dispatch(searchPhraseUpdated(inputValue));
    loadSuggestions(inputValue, _city, language, tld) //Call the backend
      .then((suggestions) => {
        const newOptions = suggestions?.map(
          (suggestion: { suggestion: string }) => ({
            //Get the New suggestions and format them the correct way
            label: suggestion.suggestion,
            value: suggestion.suggestion,
          }),
        );
        if (Array.isArray(newOptions)) {
          setOptions([...newOptions]);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const style = {
    borderRadius: "18px",
  };

  return (
    <Dialog
      open={showSearchModal}
      onClose={() => {
        setShowSearchModal(false);
      }}
      fullScreen={fullScreen}
      sx={{ "& .MuiDialog-paper": style }}
      className={"my-modal"}
    >
      <DialogTitle>
        <Typography sx={{ fontSize: "18px", fontWeight: 600 }}>
          {t("search.search")}
        </Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => {
          setShowSearchModal(false);
        }}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <CustomSelect
          options={options}
          handleSelect={handleSelect}
          handleInputChange={handleInputChange}
          searchPhrase={searchPhrase}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AutosuggestSearch;
