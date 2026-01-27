import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { Button, Collapse, useTheme } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { DebouncedInput } from './DebouncedInput';

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
  hidden?: boolean;
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
  searchTextValue?: string,
  onPageChange: (event: unknown, page: number) => void,
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onSearchTextChange: (value: string) => void,
  
  onAddActionClick: (item: any) => void,
  onEditItemClick?: (item: any) => void, // no utilizar esta propiedad, se eliminará mas adelante
  buttons?: { // no utilizar esta propiedad, se eliminará mas adelante
    edit: boolean,
    delete: boolean,
    details: boolean
  },
  itemActionList?: ItemActionListType,
  hideSearch?: boolean,
  hidePagination?: boolean,
  isCollapsible?: boolean
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
  searchTextValue,
  onPageChange,
  onRowsPerPageChange,
  onSearchTextChange,
  onAddActionClick,
  onEditItemClick,
  buttons,
  itemActionList,
  hideSearch,
  hidePagination,
  isCollapsible
}: TableProps<string | number | boolean | React.ReactNode | any>) {

  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = React.useState(-1);
  const theme = useTheme();  

  return (
    <>
      <Toolbar style={{ paddingLeft: "0px", justifyContent: hideSearch ? "flex-end" : "space-between", height: "64px" }}> 
        {
          hideSearch ? (<></>) : 
          (
            <DebouncedInput
              value={searchTextValue??''}
              onChange={onSearchTextChange}
              delay={1000}
            />
          )
        }        
        <Button 
          disableElevation onClick={() => { onAddActionClick(null); }}
          sx={{
            borderRadius: theme.shape.borderRadius,
          }}
          >
          <AddIcon fontSize="small" /> {addActionText ? addActionText : 'Add New'}	
        </Button>
      </Toolbar>
      <TableContainer 
        // sx={{ maxHeight: 500 }}
      >
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow>
              {isCollapsible && <TableCell />}
              {columns.map((column) => (
                column.hidden ? (<></>) : (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    <b>{column.label}</b>
                  </TableCell>
                )
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
                    <>
                      <TableRow hover role="checkbox" key={index}>                      
                        {isCollapsible && 
                        (
                          <TableCell>
                            <IconButton
                              aria-label="expand row"
                              size="small"
                              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                            >
                              { openIndex === index ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon /> }
                            </IconButton>
                          </TableCell>)
                        }
                        {
                          row.map((item, index) => {
                            let content;

                            if(isCollapsible && index === (row.length - 1)){
                              content = (<></>);
                            } else if(columns[index].hidden){
                              content = (<></>);
                            } else {
                              content = (
                                <TableCell>
                                  {item}
                                </TableCell>
                              )
                            }

                            return content;
                        })}
                        <TableCell>
                        {
                          itemActionList?.map((action: ItemActionType, index) => {
                            return(<IconButton key={index} onClick={() =>{ action.callBack(row) }}> {action.icon} </IconButton>)                      
                          })
                        }
                        </TableCell>
                      </TableRow>
                      <>
                      { 
                        isCollapsible && (
                          <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                            <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
                              {row[row.length-1]}
                            </Collapse>
                          </TableCell>
                        </TableRow>                        
                        )
                      }
                      </>                      
                    </>
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
            labelRowsPerPage="Filas por página"
          />
        )
      }
      
    </>
  );
}




