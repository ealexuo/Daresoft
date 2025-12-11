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
  addACtionToolTip?: string,  
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

  const timerRef = React.useRef<ReturnType<typeof setTimeout>>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleDebounce(event);
    }, debounceTimeout);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", width: '100%' }}>
      <TextField
        id="input-with-sx"
        label="Search"
        variant="standard"
        sx={{ width: 300 }}
        onChange={handleChange}
      />
      <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
    </Box>
  );
}

function validaHexa(value: string) {
  return /^#[0-9A-F]{6}[0-9a-f]{0,2}$/i.test(value);
}

export function StickyHeadTable({
  columns,
  rows,
  addActionRoute,
  addACtionToolTip,
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
      <Toolbar style={{ paddingLeft: "0px" }}>
        {
          hideSearch ? (
            <Box sx={{ 
              display: "flex", 
              alignItems: "flex-end", 
              width: '100%' 
            }}>              
            </Box>
          ) : (
            <DebounceTextField
              handleDebounce={onSearchTextChange}
              debounceTimeout={1000}
            >
            </DebounceTextField>
          )          
        }
        
        {!addActionRoute ? (
          <></>
        ) : (
          <Tooltip title={addACtionToolTip ? addACtionToolTip : ''}>
            <Fab size="small" color="primary" aria-label="add">
              <AddIcon onClick={() => {onAddActionClick(null)}} />
            </Fab>
          </Tooltip>
        )}
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




