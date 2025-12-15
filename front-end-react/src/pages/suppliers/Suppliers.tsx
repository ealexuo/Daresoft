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
import { Tooltip } from '@mui/material';
import { Contact } from '../../types/Contact';
import { contactsService } from '../../services/settings/contactsService';

const columnsInit: TableColumnType[] = [
  {
    id: "Id", 
    label: "Id", 
    minWidth: 50,
    hidden: true
  },  
  { 
    id: "Name", 
    label: "Nombre", 
    minWidth: 100 
  },
  { 
    id: "MiddleName", 
    label: "Segundo Nombre", 
    minWidth: 100 
  },  
  { 
    id: "LastName", 
    label: "Apellido", 
    minWidth: 100 
  },  
  { 
    id: "OtherName", 
    label: "Segundo Apellido", 
    minWidth: 100 
  },
  { 
    id: "Country", 
    label: "País", 
    minWidth: 100 
  },
  {
    id: "WorkEmail",
    label: "Correo Electrónico",
    minWidth: 100,    
  },
  {
    id: "WorkAddress",
    label: "Correo Electrónico",
    minWidth: 100,    
  },
  {
    id: "WorkPhone",
    label: "Teléfono",
    minWidth: 100,    
  },
  {
    id: "WorkPhoneExt",
    label: "Extensión",
    minWidth: 100,    
  },
  {
    id: "mobilePhone",
    label: "Teléfono Móvil",
    minWidth: 100,    
  },
  {
    id: "Actions",
    label: "Acciones",
    minWidth: 100,    
  }
];

// Empty user object
const emptySuplierObject: Contact = {
  id: -1,
  salutation: '',
  name: '',
  middleName: '',
  lastName: '',
  otherName: '',
  title: '',
  homeAddressLine1: '',
  homeAddressLine2: '',
  homeCity: '',
  homeState: '',
  homePostalCode: '',
  countryId: -1,
  workAddressLine1: '',
  workAddressLine2: '',
  workCity: '',
  workState: '',
  workPostalCode: '',
  workCountry: '',
  workEmail: '',
  homeEmail: '',
  homePhone: '',
  workPhone: '',
  workPhoneExt: '',
  mobilePhone: '',
  companyId: -1,
  contactTypeId: -1,
  notes: '',
  preferredAddress: -1,
  companyName: '',
  website: '',
  primaryContactId: -1,
  isSupplier: true,
  isDeleted: false,  
};

export default function Suppliers() {

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(false);
  const [columns, setColumns] = useState(columnsInit as any);
  const [rows, setRows] = useState([] as any);
  const [searchText, setSearchText] = useState<string>('');
  
  const [totalRows, setTotalRows] = useState<number>(10);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [openSupplierAddEditDialog, setOpenSupplierAddEditDialog] = useState<boolean>(false);
  const [openSupplierDeleteDialog, setOpenSupplierDeleteDialog] = useState<boolean>(false);

  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [suppliersList, setUsersList] = useState<User[]>([]);
  
  /** Fetch Data Section */
  const fetchSuppliers = useCallback(async (offset: number, fetch: number, searchText: string) => {
    try {
      setLoading(true);
      
      const rowsTemp: any[] = [];
      const response = await contactsService.getAll(offset + 1, fetch, searchText);

      if(response.statusText === 'OK') {
        if(response.data.totalCount){
          setTotalRows(response.data.totalCount);
        }

        response.data.usersList.forEach((item: any) => {
          rowsTemp.push([
            item.id,
            item.name,
            item.middleName,
            item.lastName,
            item.otherName,
            item.country,
            item.workEmail,
            item.workAddress,
            item.workPhone,
            item.workPhoneExt,
            item.mobilePhone,
          ]);
        });

        setUsersList(response.data.usersList);
        setRows(rowsTemp);
        setLoading(false);

      }
      else {
        enqueueSnackbar('Ocurrió un error al obtener la lista de usuarios.', { variant: 'error' });
      }        
    }
    catch(error: any){
      enqueueSnackbar('Ocurrió un error al obtener la lista de usuarios. Detalles: ' + error.message, { variant: 'error' });
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

  // User Add/Edit dialog
  const handleOpenUserAddEditDialog = () => {
    setSelectedSupplier(emptySuplierObject);
    setOpenSupplierAddEditDialog(true);
  }

  const handleCloseUserAddEditDialog = () => {
    setOpenSupplierAddEditDialog(false);
  }

  const handleCloseUserAddEditDialogFromAction = (refreshUsersList: boolean = false) => {
    if(refreshUsersList) {
      fetchSuppliers(currentPage, rowsPerPage, searchText);
    }
    setOpenSupplierAddEditDialog(false);
  }

  const handleSelectedUserEdit = async (supplier: any) => {    
    const supplierTemp = suppliersList.find(s => s.id === (supplier && supplier[0] ? supplier[0] : 0));
    
    if(supplierTemp) {
      setSelectedSupplier(supplierTemp);
      setOpenSupplierAddEditDialog(true);
    }    
  }

  // User Delete Alert dialog
  const handleOpenUserDeleteDialog = async (supplier: any) => {
    const supplierTemp = suppliersList.find(s => s.id === (supplier && supplier[0] ? supplier[0] : 0));
      
    setSelectedSupplier(supplierTemp);
    setOpenSupplierDeleteDialog(true);
  }

  const handleCloseUserDeleteDialog = () => {    
    setOpenSupplierDeleteDialog(false);
  }

  const handleCloseUserDeleteDialogFromAction = async (actionResult: boolean = false) => {
    if(actionResult) { 

      setLoading(true);

      try {
        const response = await usersService.delete(selectedSupplier.id); 

        if (response.statusText === "OK") {
          setLoading(false);
          fetchSuppliers(currentPage, rowsPerPage, searchText);
          enqueueSnackbar('Usuario eliminado.', { variant: "success" });
        } else {
          enqueueSnackbar('Ocurrió un error al eliminar al usuario.', { variant: "error" });
        }
      } catch (error: any) {
        enqueueSnackbar('Ocurrió un Error al eliminar al usuario. Detalles: ' + error.message, { variant: "error" });
        setLoading(false);
      }

    }
    setOpenSupplierDeleteDialog(false);
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
    fetchSuppliers(currentPage, rowsPerPage, searchText);

  }, [currentPage, rowsPerPage, searchText, fetchSuppliers]);

  /** Return Section */
  return (
    <>
      <Page title="Proveedores">
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
            ></StickyHeadTable>
          )
        }
      </Page>

      <Dialog
        open={openSupplierAddEditDialog}
        onClose={handleCloseUserAddEditDialog}
        maxWidth={"md"}        
      >
        <UserAddEditDialog 
          mode = {selectedSupplier && selectedSupplier.id > -1 ? 'edit' : 'add'}
          selectedUser = {selectedSupplier}
          onClose = {handleCloseUserAddEditDialogFromAction}
        />        
      </Dialog>

      <Dialog
        open={openSupplierDeleteDialog}
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
