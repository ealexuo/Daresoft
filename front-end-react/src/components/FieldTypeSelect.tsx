import * as React from "react";
import ListItemIcon from "@mui/material/ListItemIcon";
import {
  Autocomplete,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { templateService } from "../services/settings/templateService";
import TextFieldsIcon from "@mui/icons-material/TextFields"; // Equivalente a fa-text-width
import TitleIcon from "@mui/icons-material/Title"; // Equivalente a fa-text-height
import TagIcon from "@mui/icons-material/Tag"; // Equivalente a fa-slack-hash
import EventIcon from "@mui/icons-material/Event"; // Equivalente a fa-calendar-alt
import CheckBoxIcon from "@mui/icons-material/CheckBox"; // Equivalente a fa-check-square
import ListIcon from "@mui/icons-material/List"; // Equivalente a fa-list
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"; // Equivalente a fa-coins

interface Props {
  onSelectedFieldTypeChange: (selectedFiledType: any) => void;
}

const iconMap: Record<number, JSX.Element> = {
  1: <TextFieldsIcon />,
  2: <TitleIcon />,
  3: <TagIcon />,
  4: <EventIcon />,
  5: <CheckBoxIcon />,
  6: <ListIcon />,
  7: <MonetizationOnIcon />,
};

export default function FieldTypeSelect({ onSelectedFieldTypeChange }: Props) {
  
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const [fieldTypesList, setFieldTypesList] = useState<any[]>([]);
  const [selectedFieldType, setSelectedFieldType] = useState("");

  const handleFieldTypeChange = (newValue: any) => {    
    setSelectedFieldType(newValue ? newValue.idTipoCampo : "");
    onSelectedFieldTypeChange(newValue);
  };

  useEffect(() => {
    const fetchFieldTypes = async () => {
      setLoading(true);

      try {
        const response = await templateService.getAllFieldTypes();

        if (response.status === 200) {
          setFieldTypesList(response.data);
        } else {
          enqueueSnackbar("Error al obtener los tipos de campo.", {
            variant: "error",
          });
        }
      } catch {
        enqueueSnackbar("Error al obtener tipos de campo.", {
          variant: "error",
        });
      }

      setLoading(false);
    };

    fetchFieldTypes();
  }, [enqueueSnackbar]);

  return (
    <Autocomplete
      options={fieldTypesList}
      getOptionLabel={(option) => option.nombre}
      value={
        fieldTypesList.find((item) => item.idTipoCampo === selectedFieldType) || null
      }
      onChange={(event, newValue) => {
        handleFieldTypeChange(newValue);        
      }}
      renderOption={(props, option) => (
        <li {...props} key={option.idTipoCampo}>
          <ListItemIcon>
            {iconMap[Number(option.idTipoCampo)] || <TextFieldsIcon />}
          </ListItemIcon>
          {option.nombre}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="* Tipo de Campo"
          variant="standard"
          fullWidth
        />
      )}
    />
  );
}
