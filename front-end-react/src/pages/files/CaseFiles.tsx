import React, { useCallback, useEffect, useState } from 'react'
import {TableColumnType, StickyHeadTable, ItemActionListType} from '../../components/StickyHeadTable'
import Page from '../../components/Page'
import { usersService } from '../../services/settings/usersService';
import Loader from '../../components/Loader';
import CaseFileAddEditDialog from '../../dialogs/CaseFileAddEditDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog';
import { useSnackbar } from 'notistack';
import AlertDialog from '../../components/AlertDialog';
import { User } from '../../types/User';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
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

// Empty CaseFile object
const emptyCaseFileObject: CaseFile = {
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

  const [openCaseFileAddEditDialog, setOpenCaseFileAddEditDialog] = useState<boolean>(false);
  const [openCaseFileDeleteDialog, setOpenCaseFileDeleteDialog] = useState<boolean>(false);

  const [selectedCaseFile, setSelectedCaseFile] = useState<any>(null);
  const [caseFilesList, setCaseFilesList] = useState<User[]>([]);

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
        
        setCaseFilesList(response.data.caseFilesList);
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

  // CaseFile Add/Edit dialog
  const handleOpenCaseFileAddEditDialog = () => {
    setSelectedCaseFile(emptyCaseFileObject);
    setOpenCaseFileAddEditDialog(true);
  }

  const handleCloseCaseFileAddEditDialog = () => {
    setOpenCaseFileAddEditDialog(false);
  }

  const handleCloseCaseFileAddEditDialogFromAction = (refreshCaseFilesList: boolean = false) => {
    if(refreshCaseFilesList) {
      fetchCaseFiles(currentPage, rowsPerPage, searchText);
    }
    setOpenCaseFileAddEditDialog(false);
  }

  const handleSelectedCaseFileEdit = async (caseFile: any) => {    
    const caseFileTemp = caseFilesList.find(c => c.id === (caseFile && caseFile[0] ? caseFile[0] : 0));
    
    if(caseFileTemp) {
      setSelectedCaseFile(caseFileTemp);
      setOpenCaseFileAddEditDialog(true);
    }    
  }

  // CaseFile Delete Alert dialog
  const handleOpenCaseFileDeleteDialog = async (caseFile: any) => {
    const caseFileTemp = caseFilesList.find(c => c.id === (caseFile && caseFile[0] ? caseFile[0] : 0));
      
    setSelectedCaseFile(caseFileTemp);
    setOpenCaseFileDeleteDialog(true);
  }

  const handleCloseCaseFileDeleteDialog = () => {    
    setOpenCaseFileDeleteDialog(false);
  }

  const handleCloseCaseFileDeleteDialogFromAction = async (actionResult: boolean = false) => {
    if(actionResult) { 

      setLoading(true);

      try {
        const response = await caseFilesService.delete(selectedCaseFile.id); 

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
    setOpenCaseFileDeleteDialog(false);
  } 

  /** Defined Objects Section */
  const actionList: ItemActionListType =
  [
    { 
      name: 'edit',
      icon: <Tooltip title="Editar Usuario" arrow placement="top-start">
              <EditIcon />
            </Tooltip>,
      callBack: handleSelectedCaseFileEdit, 
    },    
    { 
      name: 'delete',
      icon: <Tooltip title="Eliminar Usuario" arrow placement="top-start">
              <DeleteIcon />
            </Tooltip>,
      callBack: handleOpenCaseFileDeleteDialog, 
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
              addActionText="Nuevo Expediente"
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRows={totalRows}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSearchTextChange={handleSearchTextChange}
              onAddActionClick={handleOpenCaseFileAddEditDialog}
              itemActionList={actionList}
              isCollapsible={true}
            ></StickyHeadTable>
          )
        }
      </Page>

      <Dialog
        open={openCaseFileAddEditDialog}
        onClose={handleCloseCaseFileAddEditDialog}
        maxWidth={"md"}        
      >
        <CaseFileAddEditDialog 
          mode = {selectedCaseFile && selectedCaseFile.id > -1 ? 'edit' : 'add'}
          selectedCaseFile = {selectedCaseFile}
          onClose = {handleCloseCaseFileAddEditDialogFromAction}
        />        
      </Dialog>

      <Dialog
        open={openCaseFileDeleteDialog}
        onClose={handleCloseCaseFileDeleteDialog}
        maxWidth={"sm"}
      >
        <AlertDialog
          color = {'error'}
          title = {'Eliminar expediente'}
          message = {'Está seguro que desea eliminar el expediente seleccionado ?'}
          onClose = {handleCloseCaseFileDeleteDialogFromAction}
        />
      </Dialog>
          
    </>
  );
}
