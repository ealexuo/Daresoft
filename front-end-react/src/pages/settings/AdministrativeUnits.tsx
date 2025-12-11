import React, { useCallback, useEffect, useState } from 'react'
import {TableColumnType, StickyHeadTable, ItemActionListType} from '../../components/StickyHeadTable'
import Page from '../../components/Page'
import Loader from '../../components/Loader';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog';
import { useSnackbar } from 'notistack';
import AlertDialog from '../../components/AlertDialog';
import { administrativeUnitsService } from '../../services/settings/administrativeUnitsService';
import AdministrativeUnitAddEditDialog from '../../dialogs/AdministrativeUnitAddEditDialog';
import { UnidadAdministrativa } from '../../types/UnidadAdministrativa';

const columnsInit: TableColumnType[] = [
  { 
    id: "administrativeUnitId", 
    label: 'ID', 
    minWidth: 5,
  },
  { 
    id: "father", 
    label: "Unidad Administrativa Padre", 
    minWidth: 100 
  },
  { 
    id: "name", 
    label: "Unidad Administrativa", 
    minWidth: 100 
  },
  { 
    id: "acronym", 
    label: "Siglas", 
    minWidth: 100 
  },  
  {
    id: "isActive",
    label: "Activa",
    minWidth: 100,    
  }, 
  {
    id: "actions",
    label: "Acciones",
    minWidth: 100,    
  }
];

const emptyAdministrativeUnitObject: UnidadAdministrativa = {
  idUnidadAdministrativa: 0,
  idUnidadAdministrativaPadre:0,
  nombreUnidadAdministrativaPadre: '',
  nombre: '',
  siglas:'',
  activa: false
}

export default function AdministrativeUnits() {

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(false);
  const [columns, setColumns] = useState(columnsInit as any);
  const [rows, setRows] = useState([] as any);
  const [searchText, setSearchText] = useState<string>('');
  
  const [totalRows, setTotalRows] = useState<number>(10);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [openAdministrativeUnitAddEditDialog, setOpenAdministrativeUnitAddEditDialog] = useState<boolean>(false);
  const [openAdministrativeUnitDeleteDialog, setOpenAdministrativeUnitDeleteDialog] = useState<boolean>(false);

  const [selectedAdministrativeUnit, setSelectedAdministrativeUnit] = useState<any>(null);  
  const [administrativeUnitslist, setAdministrativeUnitslist] = useState<any>(null);
  
  /** Fetch Data Section */
  const fetchAdministrativeUnits = useCallback(async (initialPage: number, itemsPerPage: number, searchString: string) => {
    try {
      setLoading(true);
      
      const rowsTemp: any[] = [];
      const response = await administrativeUnitsService.getAll2(initialPage + 1, itemsPerPage, searchString);

      if(response.statusText === 'OK') {
        if(response.data.cantidadTotal){
          setTotalRows(response.data.cantidadTotal);
        }

        response.data.forEach((item: any) => {        
          rowsTemp.push([
            item.idUnidadAdministrativa,
            (item.nombreUnidadAdministrativaPadre == null) ? '' : item.nombreUnidadAdministrativaPadre,
            item.nombre,
            (item.siglas == null) ? '' : item.siglas,
            item.activa
          ]);
        });

        setRows(rowsTemp);
        setLoading(false);  
      }
      else {
        enqueueSnackbar('Ocurrió un error al obtener la lista de unidades administrativas.', { variant: 'error' });
      }        
    }
    catch(error: any){
      enqueueSnackbar('Ocurrió un error al obtener la lista de unidades administrativas. Detalles: ' + error.message, { variant: 'error' });
      setLoading(false);
    }
  }, [enqueueSnackbar]);


    const fetchAdminsitrativeUnitsObject = useCallback(async () =>{ 
  
      try {
        const response = await administrativeUnitsService.getAll();
        if(response.statusText === 'OK') {
          setLoading(false);        
          const administrativeUnits = response.data;
  
          setAdministrativeUnitslist(administrativeUnits.map((ua: any) => {
            return { 
              idUnidadAdministrativa: ua.idUnidadAdministrativa, nombre: ua.nombre
            }
          }));          
        }
        else {
          enqueueSnackbar('Ocurrió un Error al obtener las unidades administrativas.', { variant: 'error' });
        }        
      }
      catch(error: any){
        enqueueSnackbar('Ocurrió un Error al obtener las unidades administrativas. Detalles: ' + error.message, { variant: 'error' });
        setLoading(false);
      }
      
      return null;    
    }, [enqueueSnackbar]); 

  const fetchAdministrativeUnit = async (administrativeUnitId: number) =>{
    
    try {
      const response = await administrativeUnitsService.get(administrativeUnitId);
      if(response.statusText === 'OK') {
        setLoading(false);        
        return response.data;
      }
      enqueueSnackbar('Error al obtener unidades administrativas.', { variant: 'error' });
    }
    catch{
      enqueueSnackbar('Error al obtener unidades administrativas.', { variant: 'error' });
      setLoading(false);
    }
    
    return null;
  };   

  const deleteSelectedAdministrativeUnit = async (unidadAdministrativaId: number) => {

    setLoading(true);

    try {
      const response = await administrativeUnitsService.delete(unidadAdministrativaId); 

      if (response.statusText === "OK") {
        setLoading(false);
        enqueueSnackbar('Unidad Administrativa eliminada.', { variant: "success" });
      } else {
        enqueueSnackbar('Ocurrió un Error al eliminar la Unidad Administrativa.', { variant: "error" });
      }
    } catch (error: any) {
      enqueueSnackbar('Ocurrió un Error al eliminar la Unidad Administrariva. Detalles: ' + error.message, { variant: "error" });
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

  // Administrative Unit Add/Edit dialog
  const handleOpenAdministrativeUnitEditDialog = () => {
    setSelectedAdministrativeUnit(emptyAdministrativeUnitObject);
    setOpenAdministrativeUnitAddEditDialog(true);
  }

  const handleCloseAdministratriveUnitAddEditDialog = () => {
    setOpenAdministrativeUnitAddEditDialog(false);
  }

  const handleCloseAdministrativeUnitAddEditDialogFromAction = (refreshAdministrativeUnitsList: boolean = false) => {
    if(refreshAdministrativeUnitsList) {
      fetchAdministrativeUnits(currentPage, rowsPerPage, searchText);      
    }
    setOpenAdministrativeUnitAddEditDialog(false);
  }

  const handleSelectedAdministrativeUnitEdit = async (administrativeUnit: any) => {
    const administrativeUnitData = await fetchAdministrativeUnit(administrativeUnit && administrativeUnit[0] ? administrativeUnit[0] : 0);        
        
    setSelectedAdministrativeUnit(administrativeUnitData);
    setOpenAdministrativeUnitAddEditDialog(true);
  }

  // Worflow Delete Alert dialog
  const handleOpenAdministrativeUnitDeleteDialog = async (administrativeUnit: any) => {
    const administrativeUnitData = await fetchAdministrativeUnit(administrativeUnit && administrativeUnit[0] ? administrativeUnit[0] : 0);
      
    setSelectedAdministrativeUnit(administrativeUnitData);
    setOpenAdministrativeUnitDeleteDialog(true);
  }

  const handleCloseAdministrativeUnitDeleteDialog = () => {    
    setOpenAdministrativeUnitDeleteDialog(false);
  }

  const handleCloseAdministrativeUnitDeleteDialogFromAction = async (actionResult: boolean = false) => {        
    if(actionResult) {
      await deleteSelectedAdministrativeUnit(selectedAdministrativeUnit.idUnidadAdministrativa);
      await fetchAdministrativeUnits(currentPage, rowsPerPage, searchText);
    }
    setOpenAdministrativeUnitDeleteDialog(false);
  } 


  /** Defined Objects Section */
  const actionList: ItemActionListType =
  [
    { 
      name: 'edit',
      icon: <EditIcon />,
      callBack: handleSelectedAdministrativeUnitEdit, 
    },
    { 
      name: 'delete',
      icon: <DeleteIcon />,
      callBack: handleOpenAdministrativeUnitDeleteDialog, 
    }
  ]; 

  /** Use Effect Section */

  useEffect(() => {

    setColumns(columnsInit);
    fetchAdministrativeUnits(currentPage, rowsPerPage, searchText);    
    fetchAdminsitrativeUnitsObject();

  }, [currentPage, rowsPerPage, searchText, fetchAdministrativeUnits]);

  /** Return Section */
  return (
    <>
      <Page title="Unidades Administrativas">
        {
          loading ? (
            <Loader />
          ) : (
            <StickyHeadTable
              columns={columns}
              rows={rows}
              addActionRoute={"/settings/administrariveUnits/add-administrativeUnit"}
              addActionToolTip="Nueva Unidad Administrativa"
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRows={totalRows}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSearchTextChange={handleSearchTextChange}
              onAddActionClick={handleOpenAdministrativeUnitEditDialog}
              itemActionList={actionList}
              hideSearch={true}
              hidePagination={true}
            ></StickyHeadTable>
          )
        }
      </Page>

      <Dialog
        open={openAdministrativeUnitAddEditDialog}
        onClose={handleCloseAdministratriveUnitAddEditDialog}
        maxWidth={"lg"}        
      >
        <AdministrativeUnitAddEditDialog 
          mode = {selectedAdministrativeUnit && selectedAdministrativeUnit.idUnidadAdministrativa > 0 ? 'edit' : 'add'}
          selectedAdministrativeUnit = {selectedAdministrativeUnit}          
          administrativeUnitsList = {administrativeUnitslist}
          onClose = {handleCloseAdministrativeUnitAddEditDialogFromAction}
        />        
      </Dialog>   
      

      <Dialog
        open={openAdministrativeUnitDeleteDialog}
        onClose={handleCloseAdministrativeUnitDeleteDialog}
        maxWidth={"sm"}
      >
        <AlertDialog
          color = {'error'}
          title = {'Eliminar Unidad Administrativa'}
          message = {'Está seguro que desea eliminar la Unidad Administrativa seleccionada?'}
          onClose = {handleCloseAdministrativeUnitDeleteDialogFromAction}
        />
      </Dialog>
          
    </>    
  );
}
