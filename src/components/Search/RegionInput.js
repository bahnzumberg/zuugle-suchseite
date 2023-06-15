import * as React from "react"
import { styled } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import InputAdornment from "@mui/material/InputAdornment"
import SearchIcon from "../../icons/SearchIcon"
import CloseFilled from "../../icons/CloseFilled"
import { useTranslation } from "react-i18next"

const CssTextField = styled(TextField)({
    "& label.Mui-focused": {
        color: "#4992FF",
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "#ECECEC",
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "#ECECEC",
        },
        "&:hover fieldset": {
            borderColor: "#ECECEC",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#ECECEC",
            borderWidth: 1,
        },
    },
})

export default function RegionInput({
    loadRegions,// passed
    region,     // passed
    setRegion,  // passed
    onFocus,
    isOpen,
    city,       // passed
    onClick,
    disabled,
    onCustomSubmit,
    setOpenRegionSearch, // passed
    resetInput,  // passed
}) {
    const { t } = useTranslation()

    return (
        <CssTextField
            className={"city-input"}
            label={t("start.suche")}
            placeholder={t("start.placeholder_suche")}
            variant="outlined"
            fullWidth
            disabled={disabled}
            value={region}
            disableautofocus="true"
            key={"region-input"}
            autoComplete={"off"}
            onChange={(event) => {
                if (!!!isOpen) {
                    setOpenRegionSearch(true)
                }
                setRegion(event.target.value)
                loadRegions({
                    search: event.target.value,
                    city: !!city ? city.value : undefined,
                })
            }}
            onFocus={() => !!onFocus && onFocus(true)}
            onBlur={() => !!onFocus && onFocus(false)}
            onClick={() => !!onClick && onClick()}
            onKeyDown={(e) => {
                if (e.key === 13) {
                    e.preventDefault()
                    e.stopPropagation()
                    if (!!onCustomSubmit) {
                        onCustomSubmit()
                    }
                }
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon
                            style={{
                                strokeWidth: 0.5,
                                stroke: "#101010",
                                fill: "#101010",
                            }}
                        />
                    </InputAdornment>
                ),
                endAdornment: (
                    <>
                        {!!region ? (
                            <InputAdornment
                                className={"cursor-link"}
                                position="end"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    if (!!resetInput) {
                                        resetInput()
                                    }
                                }}
                            >
                                <CloseFilled style={{ strokeWidth: 0.5 }} />
                            </InputAdornment>
                        ) : (
                            <></>
                        )}
                    </>
                ),
                className: "search-bar-input",
            }}
        />
    )
}
