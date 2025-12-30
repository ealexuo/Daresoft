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
import { Alert, Box, Chip, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography, useTheme } from '@mui/material';
import { CaseFile } from '../../types/CaseFile';
import { caseFilesService } from '../../services/settings/caseFilesService';
import { Task } from '../../types/Task';
import moment from 'moment';
import 'moment/locale/es';
import { DateField } from '@mui/x-date-pickers';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import SIADSearchDialog from '../../dialogs/SIADSearchDialog';
import { contactsService } from '../../services/settings/contactsService';
import { Contact } from '../../types/Contact';
import { AutoCompleteData } from '../../types/AutoCompleteData';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { EditNote, NoteAdd, NoteAddOutlined } from '@mui/icons-material';
import CaseFileNoteAddEditDialog from '../../dialogs/CaseFileNoteAddEditDialog';

const columnsInit: TableColumnType[] = [
  {
    id: "Id", 
    label: "Id", 
    minWidth: 50,
    hidden: true
  },
  { 
    id: "CaseNumber", 
    label: 'Expediente', 
    minWidth: 150 
  },
  { 
    id: "Name", 
    label: "Producto", 
    minWidth: 200 
  },
  { 
    id: "StatusMOH", 
    label: "Estado MOH", 
    minWidth: 100 
  },
  { 
    id: "TasksCountMOH", 
    label: "Notas MOH", 
    minWidth: 100 
  },
  { 
    id: "DueDateMOH", 
    label: "Fecha límite MOH", 
    minWidth: 100 
  },
  { 
    id: "ExternalIdentifierMOH", 
    label: "Identificador externo MOH", 
    minWidth: 100,
    hidden: true
  },
  { 
    id: "StatusLNS", 
    label: "Estado LNS", 
    minWidth: 100 
  },
  { 
    id: "TasksCountLNS", 
    label: "Notas LNS", 
    minWidth: 100 
  },
  { 
    id: "DueDateLNS", 
    label: "Fecha límite LNS", 
    minWidth: 100 
  },
  { 
    id: "ExternalIdentifierLNS", 
    label: "Identificador externo LNS", 
    minWidth: 100,
    hidden: true
  },
  {
    id: "Actions",
    label: "Acciones",
    minWidth: 250,
  }
];

// Empty CaseFile object
// const emptyCaseFileObject: CaseFile = {
//   id: -1,
//   caseNumber: '',
//   name: '',
//   description: '',
//   supplierId: -1,
//   supplierName: '',
//   supplierLastName: '',
//   workflowId: -1,
//   workflowName: '',
//   statusId: -1,
//   statusName: '',
//   isActive: true,
//   isDeleted: false,
//   tasks: [],
//   totalCount: 0,  
// };

export default function CaseFiles() {

  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  

  const [loading, setLoading] = useState<boolean>(false);
  const [columns, setColumns] = useState(columnsInit as any);
  const [rows, setRows] = useState([] as any);
  const [searchText, setSearchText] = useState<string>('');
  
  const [totalRows, setTotalRows] = useState<number>(10);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [openCaseFileAddEditDialog, setOpenCaseFileAddEditDialog] = useState<boolean>(false);
  const [openCaseFileDeleteDialog, setOpenCaseFileDeleteDialog] = useState<boolean>(false);
  const [openSIADSearchDialog, setOpenSIADSearchDialog] = useState<boolean>(false);
  const [openCaseFileNoteAddEditDialog, setOpenCaseFileNoteAddEditDialog] = useState<boolean>(false);

  const [selectedCaseFile, setSelectedCaseFile] = useState<any>(null);
  const [caseFilesList, setCaseFilesList] = useState<User[]>([]);
  const [suppliersList, setSupliersList] = useState<AutoCompleteData[]>([]);
  

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
                <TableCell>{task.completedDate ? task.completedDate.toString() : ''}</TableCell>                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    )
  }
  
  const generateTasksCountContent = (taskCount: number) => {

    let indicator;
    let message = taskCount + ' de 3';

    switch (taskCount) {
      case 0: 
        indicator = <Chip label='Sin notas' size="small"/>; 
        break;
      case 1: 
        indicator = <Chip label={message} sx={{ backgroundColor: theme.palette.primary.light, color: theme.palette.primary.contrastText }}/>;
        break;
      case 2: 
        indicator = <Chip label={message} sx={{ backgroundColor: theme.palette.warning.light, color: theme.palette.warning.contrastText }}/>;
        break;
      default: 
        indicator = <Chip label={message} sx={{ backgroundColor: theme.palette.error.light, color: theme.palette.error.contrastText }}/>
    }
    
    return (<>{indicator}</>);    
  }

  const generateDueDateContent = (dueDate: Date | null) => {

    let dueDateContent;

    let safeDate = new Date();
    safeDate.setDate(safeDate.getDate() - 30);

    let dangerDate = new Date();
    safeDate.setDate(safeDate.getDate() - 15);
    
    if(dueDate === null){
      dueDateContent = <></>;
    }
    else {
      
      let dueDateTemp = new Date(dueDate);

      if(dueDateTemp <= safeDate){
        dueDateContent = <Alert severity='info' variant="standard">{dueDateTemp.toLocaleDateString()}</Alert>;
      }
      else if(dueDateTemp > safeDate && dueDateTemp < dangerDate){
        dueDateContent = <Alert severity='warning' variant="standard">{dueDateTemp.toLocaleDateString()}</Alert>;
      }
      else {
        dueDateContent = <Alert severity='error' variant="standard">{dueDateTemp.toLocaleDateString()}</Alert>;
      }
    }  

    return (<>{dueDateContent}</>);
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

        response.data.caseFilesList.forEach((item: CaseFile) => {

          item.createdDate = item.createdDate ? new Date(item.createdDate) : new Date();
          
          const year = item.createdDate.getFullYear();                   
          const caseNumberTemp = item.supplierName.replace(' ', '') + '-' + item.id + '-' + year;
          const tasksMOH = item.tasks.filter(t => t.workflowId === 2).sort((t1, t2) => t2.id - t1.id);
          const tasksLNS = item.tasks.filter(t => t.workflowId === 1).sort((t1, t2) => t2.id - t1.id);

          const workflowMOH = item.workflows ? item.workflows.find(w => w.workflowId === 2) : undefined;
          const workflowLNS = item.workflows ? item.workflows.find(w => w.workflowId === 1) : undefined;

          rowsTemp.push([
            item.id,
            item.caseNumber && item.caseNumber !== '' ? item.caseNumber : caseNumberTemp,
            item.name,

            // MOH
            workflowMOH ? workflowMOH.workflowStatusName : 'Sin estado',
            generateTasksCountContent(tasksMOH.length),
            generateDueDateContent(tasksMOH.length > 0 ? tasksMOH[0].dueDate : null),
            '',

            // LNS
            workflowLNS ? workflowLNS.workflowStatusName : 'Sin estado',
            generateTasksCountContent(tasksLNS.length),
            generateDueDateContent(tasksLNS.length > 0 ? tasksLNS[0].dueDate : null),
            '',

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

  const fetchSuppliers = useCallback(async () => {
      try {
          setLoading(true);
          
          const offset = 1;
          const fetch = 10000;
          const searchText = '';
          const isSupplier = true;

          const response = await contactsService.getAll(offset, fetch, searchText, isSupplier);

          if(response.statusText === 'OK') {               
              setSupliersList(
                  response.data.contactsList.map((s: Contact) => {
                      return { 
                          id: s.id, label: s.name + (s.lastName === '' ? s.lastName : ' ' + s.lastName)
                      }
                  })              
              );
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
    setSelectedCaseFile(undefined);
    setOpenCaseFileAddEditDialog(true);
  }

  const handleCloseCaseFileAddEditDialog = () => {
    setOpenCaseFileAddEditDialog(false);
  }

  // SIAD search dialog
  const handleOpenSIADSearchDialog = async (caseFile: any) => {
    const caseFileTemp = caseFilesList.find(c => c.id === (caseFile && caseFile[0] ? caseFile[0] : 0));
    
    if(caseFileTemp) {
      setSelectedCaseFile(caseFileTemp);
      setOpenSIADSearchDialog(true);
    }      
  }

  const handleCloseSIADSearchDialog = () => {
    setOpenSIADSearchDialog(false);
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

  // CaseFile Note add/edit dialog
  const handleSelectedCaseFileAddNote = async (caseFile: any) => {    
    const caseFileTemp = caseFilesList.find(c => c.id === (caseFile && caseFile[0] ? caseFile[0] : 0));
    
    if(caseFileTemp) {
      setSelectedCaseFile(caseFileTemp);
      setOpenCaseFileNoteAddEditDialog(true);
    }    
  }

  const handleOpenCaseFileNoteAddEditDialog = async (caseFile: any) => {
    const caseFileTemp = caseFilesList.find(c => c.id === (caseFile && caseFile[0] ? caseFile[0] : 0));
      
    setSelectedCaseFile(caseFileTemp);
    setOpenCaseFileNoteAddEditDialog(true);
  }

  const handleCloseCaseFileNoteAddEditDialog = () => {    
    setOpenCaseFileNoteAddEditDialog(false);
  }

  const handleCloseCaseFileNoteAddEditDialogFromAction = async (actionResult: boolean = false) => {
    if(actionResult) { 

      // setLoading(true);

      // try {
      //   const response = await caseFilesService.delete(selectedCaseFile.id); 

      //   if (response.statusText === "OK") {
      //     setLoading(false);
      //     fetchCaseFiles(currentPage, rowsPerPage, searchText);
      //     enqueueSnackbar('Usuario eliminado.', { variant: "success" });
      //   } else {
      //     enqueueSnackbar('Ocurrió un error al eliminar al usuario.', { variant: "error" });
      //   }
      // } catch (error: any) {
      //   enqueueSnackbar('Ocurrió un Error al eliminar al usuario. Detalles: ' + error.message, { variant: "error" });
      //   setLoading(false);
      // }

    }
    setOpenCaseFileNoteAddEditDialog(false);
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
      name: 'addNote',
      icon: <Tooltip title="Nueva nota" arrow placement="top-start">
              <NoteAddOutlined />
            </Tooltip>,
      callBack: handleOpenCaseFileNoteAddEditDialog, 
    },
    { 
      name: 'edit',
      icon: <Tooltip title="Editar" arrow placement="top-start">
              <EditIcon />
            </Tooltip>,
      callBack: handleSelectedCaseFileEdit, 
    },
    { 
      name: 'siad',
      icon: <Tooltip title="Consulta SIAD" arrow placement="top-start">
              <ContentPasteSearchIcon />
            </Tooltip>,
      callBack: handleOpenSIADSearchDialog, 
    },     
    { 
      name: 'delete',
      icon: <Tooltip title="Eliminar" arrow placement="top-start">
              <DeleteIcon />
            </Tooltip>,
      callBack: handleOpenCaseFileDeleteDialog, 
    }
  ]; 

  /** Use Effect Section */

  useEffect(() => {

    setColumns(columnsInit);
    fetchCaseFiles(currentPage, rowsPerPage, searchText);
    fetchSuppliers();

  }, [currentPage, rowsPerPage, searchText, fetchCaseFiles, fetchSuppliers]);

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
          suppliersList={suppliersList}
          onClose = {handleCloseCaseFileAddEditDialogFromAction}
        />        
      </Dialog>

      <Dialog
        open={openSIADSearchDialog}
        onClose={handleCloseSIADSearchDialog}
        maxWidth={"lg"}        
      >
        <SIADSearchDialog          
          onClose = {handleCloseSIADSearchDialog}
          selectedCaseFile = {selectedCaseFile}
        />        
      </Dialog>

      <Dialog
        open={openCaseFileNoteAddEditDialog}
        onClose={handleCloseCaseFileNoteAddEditDialog}
        maxWidth={"md"}        
      >
        <CaseFileNoteAddEditDialog         
          onClose = {handleCloseCaseFileNoteAddEditDialogFromAction}
          selectedCaseFile = {selectedCaseFile}
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
