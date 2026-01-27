import { AccountCircle } from "@mui/icons-material";
import { alpha, InputAdornment, Box } from "@mui/material";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { ReactNode, useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from "@mui/material/styles";

type DebouncedTextFieldProps = {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
  icon?: ReactNode;
} & Omit<TextFieldProps, "value" | "onChange">; //combination of custom props & TextFieldProps

export const DebouncedInput: React.FC<DebouncedTextFieldProps> = ({
  value,
  onChange,
  delay = 500,
  placeholder = "Buscar...",
  ...rest
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue !== value) {
        onChange(inputValue);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay, value, onChange]);

  const theme = useTheme();

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        border: '1px solid',
        borderColor: alpha(theme.palette.common.black, 0.05),
        backgroundColor: alpha(theme.palette.common.black, 0.01),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.black, 0.05),
        },
        marginRight: theme.spacing(2),
        paddingLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(0),
          width: 'auto',
        },
      }}
    >
      <TextField
        id="input-with-icon-textfield"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon 
                sx={{ color: 'inherit', marginLeft: theme.spacing(1) }}
              />
            </InputAdornment>
          ),
          disableUnderline: true,
        }}
        variant="standard"        
        {...rest}
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => setInputValue(e.target.value)}
        sx ={{
          color: 'inherit',
          '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            //paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
              width: '20ch',
            },
          },
        }}
      />
    </Box>     
  );
};