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
import { Alert, Box, Checkbox, Chip, IconButton, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography, useTheme } from '@mui/material';
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
import { EditNote, NoteAdd, NoteAddOutlined, Work } from '@mui/icons-material';
import CaseFileNoteAddEditDialog from '../../dialogs/CaseFileNoteAddEditDialog';
import PreviewIcon from '@mui/icons-material/Preview';
import { CaseFileWorkflow } from '../../types/CaseFileWorkflow';
import { documentsService } from '../../services/settings/documentsService';
import { Document } from '../../types/Document';
import ViewDocumentDialog from '../../dialogs/ViewDocumentDialog';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { workflowsService } from '../../services/settings/workflowsService';
import { Workflow } from '../../types/Workflow';

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { tasksService } from '../../services/settings/tasksService';
import { WorkflowType } from '../../enums/WorkflowType';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import CaseFileNoteMarkCompletedDialog from '../../dialogs/CaseFileNoteMarkCompletedDialog';

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
    id: "Status", 
    label: "Estado", 
    minWidth: 100 
  },
  { 
    id: "Workflows", 
    label: "Procesos", 
    minWidth: 100 
  },
  { 
    id: "Tasks", 
    label: "Notas", 
    minWidth: 100 
  },
  { 
    id: "DueDate", 
    label: "Fecha límite", 
    minWidth: 100 
  },
  {
    id: "Actions",
    label: "Acciones",
    minWidth: 250,
  }
];

// Empty CaseFile object
const emptyCaseFile = {
    id: 0,
    caseNumber: '', 
    name: '', 
    description: '', 
    supplierContactId: -1,
    supplierName: '',
    supplierLastName: '',
    isActive: true,
    isDeleted: false,
    workflows: [],
    tasks: [],
    documents: [],
    createdDate: new Date(),
    totalCount: 0
}

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
  const [openViewDocumentDialog, setOpenViewDocumentDialog] = useState<boolean>(false);

  const [selectedCaseFile, setSelectedCaseFile] = useState<any>(null);
  const [caseFilesList, setCaseFilesList] = useState<any[]>([]);
  const [suppliersList, setSupliersList] = useState<AutoCompleteData[]>([]);

  const [documentURL, setDocumentURL] = useState<string>('');
  const [documentTitle, setDocumentTitle] = useState<string>('');

  const [workflowsList, setWorkflowsList] = useState<Workflow[]>([]);
  

  const [openMarkTaskAsCompletedDialog, setOpenMarkTaskAsCompletedDialog] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const [openDeleteTaskDialog, setOpenDeleteTaskDialog] = useState<boolean>(false);


  const generateCollapsableContent = (tasks: Task[]) => {

    const distinctWorkflows: any[] = tasks.reduce((accumulator: any, currentItem: any) => {
      const value = currentItem.workflowId;
      if (!accumulator.includes(value)) {
        accumulator.push(value);
      }
      return accumulator;
    }, []); // Start with an empty array 

    let componentsList: React.ReactNode[] = [];

    distinctWorkflows.forEach((workflowId: number) => {

      let tasksTemp = tasks.filter(t => t.workflowId === workflowId);
      
      let component =       
      <>
        <Box key={workflowId} sx={{ margin: 3, width: '100%' }} >
          <Alert severity="info" icon={<DescriptionOutlinedIcon fontSize="inherit" />}>
            {'Notas de Reparo - ' + (tasksTemp[0] ? tasksTemp[0].workflowCode : '')}
          </Alert>
          <Table size="small" aria-label="purchases">
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 10 }}><b>No.</b></TableCell>
                <TableCell style={{ minWidth: 150 }}><b>Descripción</b></TableCell>
                <TableCell style={{ minWidth: 150 }}><b>Revisor</b></TableCell>
                <TableCell style={{ minWidth: 150 }}><b>Responsable</b></TableCell>
                <TableCell style={{ minWidth: 150 }}><b>Fecha de ingreso</b></TableCell>
                <TableCell style={{ minWidth: 150 }}><b>Fecha límite</b></TableCell>
                <TableCell><b>Finalizada</b></TableCell>
                <TableCell style={{ minWidth: 150 }}><b>Fecha finalización</b></TableCell>
                <TableCell style={{ minWidth: 200 }}><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasksTemp.map((task) => (
                <TableRow hover key={task.id}>
                  <TableCell>{task.priority}</TableCell>                     
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.reviewer}</TableCell>                  
                  <TableCell>{
                    (task.assignedToUserId === null ? 'Arael (local)' : 'Proveedor') + (task.taskOwnerName ? ' - ' + task.taskOwnerName : '')
                  }
                  </TableCell>
                  <TableCell>
                    <Chip size='small' color='default' label={task.entryDate.toLocaleDateString('en-GB')}/>
                  </TableCell>
                  <TableCell>{generateTasksDueDateContent(task.dueDate)}</TableCell>
                  <TableCell><Checkbox checked={task.isCompleted} disabled={true} /></TableCell>
                  <TableCell>
                    {task.completedDate ?  <Chip size='small' color='default' label={task.completedDate.toLocaleDateString('en-GB')}/> : ''}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenViewTaskDocumentDialog(task)}>
                      <Tooltip title="Ver documento" arrow placement="top-start">
                        <ArticleOutlinedIcon />
                      </Tooltip>
                    </IconButton>
                    <IconButton onClick={() => handleOpenMarkTaskAsCompletedDialog(task)}>
                      <Tooltip title="Marcar como finalizada" arrow placement="top-start">
                        <CheckCircleOutlineIcon />
                      </Tooltip>
                    </IconButton>
                    <IconButton onClick={() => handleOpenCaseFileNoteEditDialog(task)}>
                      <Tooltip title="Editar" arrow placement="top-start">
                        <EditIcon />
                      </Tooltip>
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteTaskDialog(task)}>
                      <Tooltip title="Eliminar" arrow placement="top-start">
                        <DeleteIcon />
                      </Tooltip>
                    </IconButton>                                    
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>        
      </>      
      ;  
      componentsList.push(component);

    });   

    return(
      <>{
          componentsList.map(c => { return c})
        }
      </>
    ); 

  }
  
  const generateWorkflowListContent = (workflows: CaseFileWorkflow[], documents: Document[]) => {
    return (<Stack direction="row" spacing={1}>{
        workflows.map(w => (
        <Chip 
          label={w.workflowCode} 
          key={w.id}
          size='small'
          //sx={{ borderColor: w.workflowColor, color: w.workflowColor }}          
          variant='outlined'
          onClick={() => handleOpenViewDocumentDialog(w, documents)}
          icon={          
            documents.find(d => d.caseFileId === w.caseFileId && d.path.includes('/entry-documents/')) ?
              <ArticleOutlinedIcon /> : <></>
          }
        />) 
      )}</Stack>);    
  }

  const generateTasksCountContent = (tasks: Task[]) => {

    if(!tasks || tasks.length === 0) return (<></>);
    
    const distinctWorkflows: any[] = tasks.reduce((accumulator: any, currentItem: any) => {
      const value = currentItem.workflowId;
      if (!accumulator.includes(value)) {
        accumulator.push(value);
      }
      return accumulator;
    }, []); // Start with an empty array

    let componentsList: React.ReactNode[] = [];

    distinctWorkflows.forEach((workflowId: number) => {

      let tasksTemp = tasks.filter(t => t.workflowId === workflowId);
      let message = !tasksTemp[0] ? '' : tasksTemp[0].workflowCode + ' | ' + tasksTemp.length;
      let component;

      switch (tasksTemp.length) {
        case 0: 
          component = <></>; 
          break;
        case 1: 
          component = <Chip key={workflowId} size='small' label={message} />;
          break;
        case 2: 
          component = <Chip key={workflowId} size='small' label={message} sx={{ backgroundColor: theme.palette.warning.light, color: theme.palette.warning.contrastText }}/>;
          break;
        default: 
          component = <Chip key={workflowId} size='small' label={message} sx={{ backgroundColor: theme.palette.error.light, color: theme.palette.error.contrastText }}/>
      }

      componentsList.push(component);
    });   

    return(
      <Stack direction="row" spacing={1}>{
          componentsList.map(c => { return c})
        }
      </Stack>
    ); 
  }

  const generateTasksDueDateContent = (dueDate: Date) => {

    let safeDate = new Date();
    safeDate.setMonth(safeDate.getMonth() + 1);
    
    let dangerDate = new Date();
    dangerDate.setDate(dangerDate.getDay() + 15);

    let component: React.ReactNode;

    if(dueDate > safeDate){
      component = <Chip size='small' label={dueDate.toLocaleDateString('en-GB')} color='default'/>;
    }
    else if(dueDate <= safeDate && dueDate >= dangerDate){
      component = <Chip size='small' label={dueDate.toLocaleDateString('en-GB')} sx={{ backgroundColor: theme.palette.warning.light, color: theme.palette.warning.contrastText }}/>;
    }
    else {
      component = <Chip size='small' label={dueDate.toLocaleDateString('en-GB')} sx={{ backgroundColor: theme.palette.error.light, color: theme.palette.error.contrastText }}/>;
    }

    return(
      <>{component}</>
    ); 
  }


  const generateTasksDueDateByWorkflowContent = (tasks: Task[]) => {

    if(!tasks || tasks.length === 0) return (<></>);

    let safeDate = new Date();
    safeDate.setMonth(safeDate.getMonth() + 1);
    
    let dangerDate = new Date();
    dangerDate.setDate(dangerDate.getDay() + 15);

    const distinctWorkflows: any[] = tasks.reduce((accumulator: any, currentItem: any) => {
      const value = currentItem.workflowId;
      if (!accumulator.includes(value)) {
        accumulator.push(value);
      }
      return accumulator;
    }, []); 

    let componentsList: React.ReactNode[] = [];

    distinctWorkflows.forEach((workflowId: number) => {

      let tasksTemp = tasks.filter(t => t.workflowId === workflowId);
      let latestTask =  tasksTemp.at(-1);

      let message = latestTask?.workflowCode + ' | ' + latestTask?.dueDate.toLocaleDateString('en-GB');
      let component;

      if(latestTask?.dueDate) {

        if(latestTask.dueDate > safeDate){
          component = <Chip key={workflowId} size='small' label={message} color='default'/>;
        }
        else if(latestTask.dueDate <= safeDate && latestTask.dueDate >= dangerDate){
          component = <Chip key={workflowId} size='small' label={message} sx={{ backgroundColor: theme.palette.warning.light, color: theme.palette.warning.contrastText }}/>;
        }
        else {
          component = <Chip key={workflowId} size='small' label={message} sx={{ backgroundColor: theme.palette.error.light, color: theme.palette.error.contrastText }}/>;
        }
      }     

      componentsList.push(component);
    });

    return(
      <Stack direction="row" spacing={1}>{
          componentsList.map(c => { return c})
        }
      </Stack>
    ); 
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

          item.tasks = item.tasks.map(t => {
            t.entryDate = new Date(t.entryDate);
            t.dueDate = new Date(t.dueDate);            
            t.completedDate = t.completedDate ? new Date(t.completedDate) : null;
            return t
          });
                 
          const workflowMOH = item.workflows ? item.workflows.find(w => w.workflowId === WorkflowType.MOH) : undefined;
          const workflowLNS = item.workflows ? item.workflows.find(w => w.workflowId === WorkflowType.LNS) : undefined;

          rowsTemp.push([
            item.id,
            item.caseNumber && item.caseNumber !== '' ? item.caseNumber : caseNumberTemp,
            item.name,
            workflowMOH ? workflowMOH.workflowStatusName : workflowLNS ? workflowLNS.workflowStatusName : 'Sin estado',
            generateWorkflowListContent(item.workflows, item.documents),
            generateTasksCountContent(item.tasks),
            generateTasksDueDateByWorkflowContent(item.tasks),
            
            // Colapsable Content at the end of the array
            generateCollapsableContent(item.tasks), 
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
                          id: s.id, label: s.companyName
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

  const fetchWorklows = useCallback(async () => {
      try {
          setLoading(true);
          
          const offset = 1;
          const fetch = 10000;
          const searchText = '';

          const response = await workflowsService.getAll(offset, fetch, searchText);

          if(response.statusText === 'OK') {               
              setWorkflowsList(response.data);
              setLoading(false);
          }
          else {
              enqueueSnackbar('Ocurrió un error al obtener la lista de procesos.', { variant: 'error' });
          }        
      }
      catch(error: any){
          enqueueSnackbar('Ocurrió un error al obtener la lista de procesos. Detalles: ' + error.message, { variant: 'error' });
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

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  // CaseFile Add/Edit dialog
  const handleOpenCaseFileAddEditDialog = () => {
    setSelectedCaseFile(emptyCaseFile);
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

  const handleCloseSIADSearchDialogFromAction = (refreshCaseFilesList: boolean = false) => {
    if(refreshCaseFilesList) {
      fetchCaseFiles(currentPage, rowsPerPage, searchText);
    }
    setOpenSIADSearchDialog(false);
  }

  // Documents Link dialog
  const handleOpenDocumentsLinkDialog = async (caseFile: any) => {
    const caseFileTemp = caseFilesList.find(c => c.id === (caseFile && caseFile[0] ? caseFile[0] : 0));
    if(caseFileTemp) {
      window.open(caseFileTemp.url, '_blank');
    }
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

  const handleOpenCaseFileNoteAddDialog = async (caseFile: any) => {
    const caseFileTemp = caseFilesList.find(c => c.id === (caseFile && caseFile[0] ? caseFile[0] : 0));
    
    setSelectedTask(null);
    setSelectedCaseFile(caseFileTemp);
    setOpenCaseFileNoteAddEditDialog(true);
  }

  const handleOpenCaseFileNoteEditDialog = async (task: any) => {
    setSelectedCaseFile(null);    
    setSelectedTask(task);    
    setOpenCaseFileNoteAddEditDialog(true);
  }

  const handleCloseCaseFileNoteAddEditDialog = () => {    
    setOpenCaseFileNoteAddEditDialog(false);
  }

  const handleCloseCaseFileNoteAddEditDialogFromAction = async (actionResult: boolean = false) => {
    if(actionResult) { 
      fetchCaseFiles(currentPage, rowsPerPage, searchText);
    }
    setOpenCaseFileNoteAddEditDialog(false);
  }

  // Document viewer dialog - CaseFile Entry Document
  const handleOpenViewDocumentDialog = async (workflow: CaseFileWorkflow, documents: Document[]) => {

    const pathContent = '/workflows/' + workflow.workflowId + '/entry-documents/';
    const documentTemp = documents.find(d => d.caseFileId === workflow.caseFileId && d.path.includes(pathContent));

    console.log('View Document', documentTemp);

    if(! documentTemp) return;

    const response = await documentsService.getReadUrl(documentTemp ? documentTemp.id: 0);
    setDocumentURL(response.data);
    setDocumentTitle('Documento: ' + documentTemp.name);
    setOpenViewDocumentDialog(true);
  }

  // Document viewer dialog - Task Document
  const handleOpenViewTaskDocumentDialog = async (task: Task) => {
        
    const documentTemp = task.documents && task.documents.length > 0 ? task.documents[0] : null;
    if(! documentTemp) return;
    
    const response = await documentsService.getReadUrl(documentTemp ? documentTemp.id: 0);
    
    console.log('View Task Document', response);

    setDocumentURL(response.data);    
    setOpenViewDocumentDialog(true);
  }

  const handleCloseViewDocumentDialog = () => {    
    setOpenViewDocumentDialog(false);
  }

  // Mark Task As Completed dialog
  const handleOpenMarkTaskAsCompletedDialog = async (task: Task) => {
    setSelectedTask(task);
    setOpenMarkTaskAsCompletedDialog(true);
  }

  const handleCloseMarkTaskAsCompletedDialog = () => {
    setOpenMarkTaskAsCompletedDialog(false);
  }

  const handleCloseMarkTaskAsCompletedDialogFromAction = async (actionResult: boolean = false) => {

    if(actionResult) { 
      fetchCaseFiles(currentPage, rowsPerPage, searchText);
    }
    setOpenMarkTaskAsCompletedDialog(false);

  }

  // CaseFile Delete Alert dialog
  const handleOpenCaseFileDeleteDialog = async (caseFile: any) => {
    const caseFileTemp = caseFilesList.find(c => c.id === (caseFile && caseFile[0] ? caseFile[0] : 0));
      
    setSelectedCaseFile(caseFileTemp);
    setOpenCaseFileDeleteDialog(true);
  }

  const handleCloseCaseFileDeleteDialog = () => {    
    
    console.log('Closing CaseFile Delete Dialog');
    
    setOpenCaseFileDeleteDialog(false);

  }

  const handleCloseCaseFileDeleteDialogFromAction = async (actionResult: boolean = false) => {
     
    setLoading(true);

    try {

      if(actionResult && selectedCaseFile) {
        const response = await caseFilesService.delete(selectedCaseFile.id); 

        if (response.statusText === "OK") {
          setLoading(false);
          fetchCaseFiles(currentPage, rowsPerPage, searchText);
          enqueueSnackbar('Expediente eliminado.', { variant: "success" });
        } else {
          enqueueSnackbar('Ocurrió un error al eliminar el expediente.', { variant: "error" });
        }  
      }

    } catch (error: any) {
      enqueueSnackbar('Ocurrió un error al eliminar el expediente. Detalles: ' + error.message, { variant: "error" });
    }
    finally {
      setLoading(false);
      setOpenCaseFileDeleteDialog(false);
    }
    
  } 

  // Delete task dialog
  const handleOpenDeleteTaskDialog = async (task: Task) => {
    setSelectedTask(task);
    setOpenDeleteTaskDialog(true);
  }

  const handleCloseDeleteTaskDialog = () => {
    setOpenDeleteTaskDialog(false);
  }

  const handleCloseDeleteTaskDialogFromAction = async (actionResult: boolean = false) => {
    
    if(actionResult) {
      try {
        setLoading(true);

        const result = await tasksService.delete(selectedTask.id);

        if(result.statusText === 'OK'){
          enqueueSnackbar('Nota eliminada.', { variant: 'success' });
          fetchCaseFiles(currentPage, rowsPerPage, searchText);
        }
        else {
          enqueueSnackbar('Ocurrió un error al eliminar la nota.', { variant: 'error' });
        }
      }
      catch(error: any){
        enqueueSnackbar('Ocurrió un error al eliminar la nota. Detalles: ' + error.message, { variant: 'error' });
      }
      finally{
        setLoading(false);
        setOpenDeleteTaskDialog(false);
      }
    }

  }


  /** Defined Objects Section */
  const actionList: ItemActionListType =
  [    
    { 
      name: 'addNote',
      icon: <Tooltip title="Nueva nota" arrow placement="top-start">
              <NoteAddOutlined />
            </Tooltip>,
      callBack: handleOpenCaseFileNoteAddDialog, 
    },    
    { 
      name: 'siad',
      icon: <Tooltip title="Consulta SIAD" arrow placement="top-start">
              <ContentPasteSearchIcon />
            </Tooltip>,
      callBack: handleOpenSIADSearchDialog, 
    },
    { 
      name: 'documentsLink',
      icon: <Tooltip title="Google Drive folder" arrow placement="top-start">
              <FolderOpenOutlinedIcon />
            </Tooltip>,
      callBack: handleOpenDocumentsLinkDialog, 
    },
    { 
      name: 'edit',
      icon: <Tooltip title="Editar" arrow placement="top-start">
              <EditIcon />
            </Tooltip>,
      callBack: handleSelectedCaseFileEdit, 
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
    fetchWorklows();

  }, [currentPage, rowsPerPage, searchText, fetchCaseFiles, fetchSuppliers, fetchWorklows]);

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
              addActionText="Ingresar expediente"
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
          mode = {selectedCaseFile && selectedCaseFile.id > 0 ? 'edit' : 'add'}
          selectedCaseFile = {selectedCaseFile}
          suppliersList={suppliersList}
          workflowsList={workflowsList}
          onClose = {handleCloseCaseFileAddEditDialogFromAction}
        />        
      </Dialog>

      <Dialog
        open={openSIADSearchDialog}
        onClose={handleCloseSIADSearchDialog}
        maxWidth={"lg"}        
      >
        <SIADSearchDialog          
          onClose = {handleCloseSIADSearchDialogFromAction}
          selectedCaseFile = {selectedCaseFile}
        />        
      </Dialog>

      <Dialog
        open={openCaseFileNoteAddEditDialog}
        onClose={handleCloseCaseFileNoteAddEditDialog}
        maxWidth={"md"}        
      >
        <CaseFileNoteAddEditDialog 
          mode = {selectedCaseFile ? 'add' : selectedTask ? 'edit' : 'add'}        
          onClose = {handleCloseCaseFileNoteAddEditDialogFromAction}
          workflowsList={workflowsList}
          selectedCaseFile = {selectedCaseFile}
          selectedTask = {selectedTask}
        />
      </Dialog>

      <Dialog
        open={openViewDocumentDialog}
        onClose={handleCloseViewDocumentDialog}
        maxWidth={"lg"}        
      >
        <ViewDocumentDialog
          title={documentTitle}
          documentURL={documentURL}      
          onClose = {handleCloseViewDocumentDialog}
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

      <Dialog
        open={openMarkTaskAsCompletedDialog}
        onClose={handleCloseMarkTaskAsCompletedDialog}
        maxWidth={"sm"}
      >
        <CaseFileNoteMarkCompletedDialog
          selectedCaseFile = {selectedCaseFile}
          selectedTask = {selectedTask}
          onClose = {handleCloseMarkTaskAsCompletedDialogFromAction}
        />
      </Dialog>

      <Dialog
        open={openDeleteTaskDialog}
        onClose={handleCloseDeleteTaskDialog}
        maxWidth={"sm"}
      >
        <AlertDialog
          color = {'error'}
          title = {'Eliminar nota'}
          message = {'Está seguro que desea eliminar la nota seleccionada ?'}
          onClose = {handleCloseDeleteTaskDialogFromAction}
        />
      </Dialog>
          
    </>
  );
}
