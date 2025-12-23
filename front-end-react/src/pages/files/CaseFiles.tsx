import React, { useCallback, useEffect, useState } from 'react'
import {TableColumnType, StickyHeadTable, ItemActionListType} from '../../components/StickyHeadTable'
import Page from '../../components/Page'
import { usersService } from '../../services/settings/usersService';
import Loader from '../../components/Loader';
import UserAddEditDialog from '../../dialogs/UserAddEditDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog';
import { useSnackbar } from 'notistack';
import AlertDialog from '../../components/AlertDialog';
import { User } from '../../types/User';
import { Box, Collapse, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { CaseFile } from '../../types/CaseFile';
import { caseFilesService } from '../../services/settings/caseFilesService';
import { Task } from '../../types/Task';

const columnsInit: TableColumnType[] = [
  {
    id: "Id", 
    label: "Id", 
    minWidth: 50,
    hidden: true
  },
  { 
    id: "CaseNumber", 
    label: 'Número de Expediente', 
    minWidth: 50 
  },
  { 
    id: "Name", 
    label: "Nombre", 
    minWidth: 100 
  },
  { 
    id: "Description", 
    label: "Descripción", 
    minWidth: 100 
  },
  { 
    id: "SupplierName", 
    label: "Nombre Proveedor", 
    minWidth: 100 
  },
  { 
    id: "SupplierLastName", 
    label: "Apellido Proveedor", 
    minWidth: 100 
  },
  {
    id: "WorkflowName",
    label: "Proceso",
    minWidth: 100,    
  },
  {
    id: "StatusName",
    label: "Estado",
    minWidth: 100,    
  },  
  {
    id: "Actions",
    label: "Acciones",
    minWidth: 100,    
  }
];

// Empty filecase object
const emptyFileCaseObject: CaseFile = {
  id: -1,
  caseNumber: '',
  name: '',
  description: '',
  supplierId: -1,
  supplierName: '',
  supplierLastName: '',
  workflowId: -1,
  workflowName: '',
  statusId: -1,
  statusName: '',
  isActive: true,
  isDeleted: false,
  tasks: [],
  totalCount: 0,  
};

export default function CaseFiles() {

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(false);
  const [columns, setColumns] = useState(columnsInit as any);
  const [rows, setRows] = useState([] as any);
  const [searchText, setSearchText] = useState<string>('');
  
  const [totalRows, setTotalRows] = useState<number>(10);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [openUserAddEditDialog, setOpenUserAddEditDialog] = useState<boolean>(false);
  const [openUserDeleteDialog, setOpenUserDeleteDialog] = useState<boolean>(false);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [usersList, setUsersList] = useState<User[]>([]);

  const generateCollapsableContent = (tasks: Task[]) => {
    return (
      <Box sx={{ margin: 1 }}>
        <Typography variant="h6" gutterBottom component="div">
          Notas de reparo
        </Typography>
        <Table size="small" aria-label="purchases">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Usuario Asignado</TableCell>
              <TableCell>Finalizada</TableCell>
              <TableCell>Fecha Finalización</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell component="th" scope="row">{task.name}</TableCell>
                <TableCell>{task.description}</TableCell>                
                <TableCell>{task.assignedToUserId}</TableCell>
                <TableCell>{task.isCompleted}</TableCell>
                <TableCell>{task.completedDate.toString()}</TableCell>                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    )
  }
  
  /** Fetch Data Section */
  const fetchCaseFiles = useCallback(async (offset: number, fetch: number, searchText: string) => {
    try {
      setLoading(true);
      
      const rowsTemp: any[] = [];
      const response = await caseFilesService.getAll(offset + 1, fetch, searchText);

      if(response.statusText === 'OK') {
        if(response.data.totalCount){
          setTotalRows(response.data.totalCount);
        }

        response.data.caseFilesList.forEach((item: any) => {
          rowsTemp.push([
            item.id,
            item.caseNumber,
            item.name,
            item.description,
            item.supplierName,
            item.supplierLastName,
            item.workflowName,
            item.statusName,
            generateCollapsableContent(item.tasks), // Colapsable Content at the end of the array
          ]);
        });
        
        setUsersList(response.data.caseFilesList);
        setRows(rowsTemp);
        setLoading(false);
      }
      else {
        enqueueSnackbar('Ocurrió un error al obtener la lista de expedientes.', { variant: 'error' });
      }        
    }
    catch(error: any){
      enqueueSnackbar('Ocurrió un error al obtener la lista de expedientes. Detalles: ' + error.message, { variant: 'error' });
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  /** Handle Functions Section */

  const handlePageChange = (event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setCurrentPage(0);
  };

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  // FileCase Add/Edit dialog
  const handleOpenUserAddEditDialog = () => {
    setSelectedUser(emptyFileCaseObject);
    setOpenUserAddEditDialog(true);
  }

  const handleCloseUserAddEditDialog = () => {
    setOpenUserAddEditDialog(false);
  }

  const handleCloseUserAddEditDialogFromAction = (refreshUsersList: boolean = false) => {
    if(refreshUsersList) {
      fetchCaseFiles(currentPage, rowsPerPage, searchText);
    }
    setOpenUserAddEditDialog(false);
  }

  const handleSelectedUserEdit = async (user: any) => {    
    const userTemp = usersList.find(u => u.id === (user && user[0] ? user[0] : 0));
    
    if(userTemp) {
      setSelectedUser(userTemp);
      setOpenUserAddEditDialog(true);
    }    
  }

  // User Delete Alert dialog
  const handleOpenUserDeleteDialog = async (user: any) => {
    const userTemp = usersList.find(u => u.id === (user && user[0] ? user[0] : 0));
      
    setSelectedUser(userTemp);
    setOpenUserDeleteDialog(true);
  }

  const handleCloseUserDeleteDialog = () => {    
    setOpenUserDeleteDialog(false);
  }

  const handleCloseUserDeleteDialogFromAction = async (actionResult: boolean = false) => {
    if(actionResult) { 

      setLoading(true);

      try {
        const response = await usersService.delete(selectedUser.id); 

        if (response.statusText === "OK") {
          setLoading(false);
          fetchCaseFiles(currentPage, rowsPerPage, searchText);
          enqueueSnackbar('Usuario eliminado.', { variant: "success" });
        } else {
          enqueueSnackbar('Ocurrió un error al eliminar al usuario.', { variant: "error" });
        }
      } catch (error: any) {
        enqueueSnackbar('Ocurrió un Error al eliminar al usuario. Detalles: ' + error.message, { variant: "error" });
        setLoading(false);
      }

    }
    setOpenUserDeleteDialog(false);
  } 

  /** Defined Objects Section */
  const actionList: ItemActionListType =
  [
    { 
      name: 'edit',
      icon: <Tooltip title="Editar Usuario" arrow placement="top-start">
              <EditIcon />
            </Tooltip>,
      callBack: handleSelectedUserEdit, 
    },    
    { 
      name: 'delete',
      icon: <Tooltip title="Eliminar Usuario" arrow placement="top-start">
              <DeleteIcon />
            </Tooltip>,
      callBack: handleOpenUserDeleteDialog, 
    }
  ]; 

  /** Use Effect Section */

  useEffect(() => {

    setColumns(columnsInit);
    fetchCaseFiles(currentPage, rowsPerPage, searchText);

  }, [currentPage, rowsPerPage, searchText, fetchCaseFiles]);

  /** Return Section */
  return (
    <>
      <Page title="Expedientes">
        {
          loading ? (
            <Loader />
          ) : (
            <StickyHeadTable
              columns={columns}
              rows={rows}
              addActionRoute={"/settings/users/add-user"}
              addActionText="Nuevo Usuario"
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRows={totalRows}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSearchTextChange={handleSearchTextChange}
              onAddActionClick={handleOpenUserAddEditDialog}
              itemActionList={actionList}
              isCollapsible={true}
            ></StickyHeadTable>
          )
        }
      </Page>

      <Dialog
        open={openUserAddEditDialog}
        onClose={handleCloseUserAddEditDialog}
        maxWidth={"md"}        
      >
        <UserAddEditDialog 
          mode = {selectedUser && selectedUser.id > -1 ? 'edit' : 'add'}
          selectedUser = {selectedUser}
          onClose = {handleCloseUserAddEditDialogFromAction}
        />        
      </Dialog>

      <Dialog
        open={openUserDeleteDialog}
        onClose={handleCloseUserDeleteDialog}
        maxWidth={"sm"}
      >
        <AlertDialog
          color = {'error'}
          title = {'Eliminar usuario'}
          message = {'Está seguro que desea eliminar el usuario seleccionado ?'}
          onClose = {handleCloseUserDeleteDialogFromAction}
        />
      </Dialog>
          
    </>    
  );
}
