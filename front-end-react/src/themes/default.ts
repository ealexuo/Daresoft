import { createTheme } from "@mui/material";

const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3D6599',
    },    
  },
  components: {
    MuiDialogActions: {
      styleOverrides: {
        root: {
          margin: '8px'          
        },
      },
    },
    MuiTab:{
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '16px'
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        },
      },
    },
  }
});

export default defaultTheme;