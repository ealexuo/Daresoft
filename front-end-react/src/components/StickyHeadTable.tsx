import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';
import { alpha, Button, InputBase, styled } from '@mui/material';

export type ItemActionType = {
  name: string;
  icon: React.ReactNode;
  tooltip?: string;
  callBack: (item: any) => void;
}

export type ItemActionListType = ItemActionType[];

export type TableColumnType = {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  format?: (value: number) => string;
}

export type TableRowsType<T> = T[][];

type TableProps<T> = {
  columns: TableColumnType[],
  rows: TableRowsType<T>,
  addActionRoute?: string,
  addActionToolTip?: string,  
  addActionText?: string,
  totalRows: number,
  currentPage: number,
  rowsPerPage: number,
  onPageChange: (event: unknown, page: number) => void,
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onSearchTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onAddActionClick: (item: any) => void,
  onEditItemClick?: (item: any) => void, // no utilizar esta propiedad, se eliminará mas adelante
  buttons?: { // no utilizar esta propiedad, se eliminará mas adelante
    edit: boolean,
    delete: boolean,
    details: boolean
  },
  itemActionList?: ItemActionListType,
  hideSearch?: boolean,
  hidePagination?: boolean
}

function DebounceTextField({ handleDebounce, debounceTimeout }: any) {

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
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
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    color: 'gray',
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleDebounce(event);
    }, debounceTimeout);
  };

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Buscar…"
        inputProps={{ 'aria-label': 'buscar' }}
        onChange={handleChange}
      />
    </Search>
  );
}

function validaHexa(value: string) {
  return /^#[0-9A-F]{6}[0-9a-f]{0,2}$/i.test(value);
}

export function StickyHeadTable({
  columns,
  rows,
  addActionRoute,
  addActionToolTip,
  addActionText,
  currentPage,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  onSearchTextChange,
  onAddActionClick,
  onEditItemClick,
  buttons,
  itemActionList,
  hideSearch,
  hidePagination,
}: TableProps<string | number | boolean | React.ReactNode | any>) {

  const navigate = useNavigate();

  return (
    <>
      <Toolbar style={{ paddingLeft: "0px", justifyContent: hideSearch ? "flex-end" : "space-between" }}> 
        {
          hideSearch ? (<></>) : 
          (
            <DebounceTextField
              handleDebounce={onSearchTextChange}
              debounceTimeout={1000}
            >
            </DebounceTextField>
          )
        }        
        <Button disableElevation onClick={() => { onAddActionClick(null); }}>
          <AddIcon fontSize="small" /> {addActionText ? addActionText : 'Add New'}	
        </Button>
      </Toolbar>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <b>{column.label}</b>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          { 
            rows.length === 0 ? 
            (<div>No data available</div>) : 
            (
              <TableBody>
                {rows.map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" key={index}>
                      {row.map((item, index) => {
                        return (
                          ( typeof item === "object" 
                            ? ''
                            : (<TableCell align={columns[index].align} key={index}>
                            {typeof item === "boolean" 
                            ? ( <Checkbox checked={item} disabled={true} />) 
                            : ( validaHexa(item) 
                              ? (<div style={{ width: "8mm", height: "8mm", backgroundColor: item }}></div>)
                              : ( typeof item === "object" 
                                  ? ''
                                  : item)
                            )}
                          </TableCell>))                      
                        );
                      })}
                      <TableCell>
                      {
                        itemActionList?.map((action: ItemActionType, index) => {
                          return(<IconButton key={index} onClick={() =>{ action.callBack(row) }}> {action.icon} </IconButton>)                      
                        })
                      }
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            ) 
          }          
        </Table>
      </TableContainer>
      {
        hidePagination ? (<></>) : (
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={totalRows ? totalRows : rows.length}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        )
      }
      
    </>
  );
}




