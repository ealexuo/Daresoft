
import React, { useCallback, useEffect, useState } from 'react'
import {TableColumnType, StickyHeadTable, ItemActionListType} from '../../components/StickyHeadTable'
import Page from '../../components/Page'
import Loader from '../../components/Loader';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog';
import { useSnackbar } from 'notistack';
import AlertDialog from '../../components/AlertDialog';
import { originService } from '../../services/settings/originService';
import OriginAddEditDialog from '../../dialogs/OriginAddEditDialog';
import { Origen } from '../../types/Origen';

const columnsInit: TableColumnType[] = [
  { 
    id: "originId", 
    label: 'ID', 
    minWidth: 5,
  },
  { 
    id: "name", 
    label: "Origen", 
    minWidth: 100 
  },  
  {
    id: "isActive",
    label: "Activo",
    minWidth: 100,    
  }, 
  {
    id: "actions",
    label: "Acciones",
    minWidth: 100,    
  }
];

const emptyOriginObject: Origen = {
  idOrigen: 0,  
  nombre: '',  
  activo: false  
}  

export default function Origins() {

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(false);
  const [columns, setColumns] = useState(columnsInit as any);
  const [rows, setRows] = useState([] as any);
  const [searchText, setSearchText] = useState<string>('');
  
  const [totalRows, setTotalRows] = useState<number>(10);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [openOriginAddEditDialog, setOpenOriginAddEditDialog] = useState<boolean>(false);
  const [openOriginDeleteDialog, setOpenOriginDeleteDialog] = useState<boolean>(false);

  const [selectedOrigin, setSelectedOrigin] = useState<any>(null);  
  
  /** Fetch Data Section */
  const fetchOrigins = useCallback(async (initialPage: number, itemsPerPage: number, searchString: string) => {
    try {
      setLoading(true);
      
      const rowsTemp: any[] = [];
      const response = await originService.getAll(initialPage + 1, itemsPerPage, searchString);

      if(response.statusText === 'OK') {
        if(response.data.cantidadTotal){
          setTotalRows(response.data.cantidadTotal);
        }
        
        response.data.forEach((item: any) => {
          rowsTemp.push([
            item.idOrigen,
            item.nombre,
            item.activo
          ]);
        });

        setRows(rowsTemp);
        setLoading(false);  
      }
      else {
        enqueueSnackbar('Ocurrió un error al obtener la lista de origenes.', { variant: 'error' });
      }        
    }
    catch(error: any){
      enqueueSnackbar('Ocurrió un error al obtener la lista de origenes. Detalles: ' + error.message, { variant: 'error' });
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const fetchOrigin = async (originId: number) =>{
    
    try {
      const response = await originService.get(originId);
      if(response.statusText === 'OK') {
        setLoading(false);        
        return response.data;
      }
      enqueueSnackbar('Error al obtener origen.', { variant: 'error' });
    }
    catch{
      enqueueSnackbar('Error al obtener origen.', { variant: 'error' });
      setLoading(false);
    }
    
    return null;
  };   

  const deleteSelectedOrigin = async (origenId: number) => {

    setLoading(true);

    try {
      const response = await originService.delete(origenId); 

      if (response.statusText === "OK") {
        setLoading(false);
        enqueueSnackbar('Origen eliminado.', { variant: "success" });
      } else {
        enqueueSnackbar('Ocurrió un Error al eliminar el origen.', { variant: "error" });
      }
    } catch (error: any) {
      enqueueSnackbar('Ocurrió un Error al eliminar el origen. Detalles: ' + error.message, { variant: "error" });
      setLoading(false);
    }

  }

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

  // Origin Add/Edit dialog
  const handleOpenOriginEditDialog = () => {
    setSelectedOrigin(emptyOriginObject);
    setOpenOriginAddEditDialog(true);
  }

  const handleCloseOriginAddEditDialog = () => {
    setOpenOriginAddEditDialog(false);
  }

  const handleCloseOriginAddEditDialogFromAction = (refreshOriginsList: boolean = false) => {
    if(refreshOriginsList) {
      fetchOrigins(currentPage, rowsPerPage, searchText);
    }
    setOpenOriginAddEditDialog(false);
  }

  const handleSelectedOriginEdit = async (origin: any) => {
    const originData = await fetchOrigin(origin && origin[0] ? origin[0] : 0);        
        
    setSelectedOrigin(originData);
    setOpenOriginAddEditDialog(true);
  }

  // Worflow Delete Alert dialog
  const handleOpenOriginDeleteDialog = async (origin: any) => {
    const originData = await fetchOrigin(origin && origin[0] ? origin[0] : 0);
      
    setSelectedOrigin(originData);
    setOpenOriginDeleteDialog(true);
  }

  const handleCloseOriginDeleteDialog = () => {    
    setOpenOriginDeleteDialog(false);
  }

  const handleCloseOriginDeleteDialogFromAction = async (actionResult: boolean = false) => {
    if(actionResult) {
      await deleteSelectedOrigin(selectedOrigin.idOrigen);
      await fetchOrigins(currentPage, rowsPerPage, searchText);
    }
    setOpenOriginDeleteDialog(false);
  } 


  /** Defined Objects Section */
  const actionList: ItemActionListType =
  [
    { 
      name: 'edit',
      icon: <EditIcon />,
      callBack: handleSelectedOriginEdit, 
    },
    { 
      name: 'delete',
      icon: <DeleteIcon />,
      callBack: handleOpenOriginDeleteDialog, 
    }
  ]; 

  /** Use Effect Section */

  useEffect(() => {

    setColumns(columnsInit);
    fetchOrigins(currentPage, rowsPerPage, searchText);    

  }, [currentPage, rowsPerPage, searchText, fetchOrigins]);

  /** Return Section */
  return (
    <>
      <Page title="Orígenes">
        {
          loading ? (
            <Loader />
          ) : (
            <StickyHeadTable
              columns={columns}
              rows={rows}
              addActionRoute={"/settings/origins/add-origin"}
              addActionToolTip="Nuevo Origen"
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRows={totalRows}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSearchTextChange={handleSearchTextChange}
              onAddActionClick={handleOpenOriginEditDialog}
              itemActionList={actionList}
              hideSearch={true}
              hidePagination={true}
            ></StickyHeadTable>
          )
        }
      </Page>

      <Dialog
        open={openOriginAddEditDialog}
        onClose={handleCloseOriginAddEditDialog}
        maxWidth={"lg"}        
      >
        <OriginAddEditDialog 
          mode = {selectedOrigin && selectedOrigin.idOrigen > 0 ? 'edit' : 'add'}
          selectedOrigin = {selectedOrigin}          
          onClose = {handleCloseOriginAddEditDialogFromAction}
        />        
      </Dialog>   
      

      <Dialog
        open={openOriginDeleteDialog}
        onClose={handleCloseOriginDeleteDialog}
        maxWidth={"sm"}
      >
        <AlertDialog
          color = {'error'}
          title = {'Eliminar origen'}
          message = {'Está seguro que desea eliminar el origen seleccionado ?'}
          onClose = {handleCloseOriginDeleteDialogFromAction}
        />
      </Dialog>
          
    </>    
  );
}
