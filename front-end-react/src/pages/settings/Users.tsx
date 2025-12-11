import React, { useCallback, useEffect, useState } from 'react'
import {TableColumnType, StickyHeadTable, ItemActionListType} from '../../components/StickyHeadTable'
import Page from '../../components/Page'
import { userService } from '../../services/settings/userService';
import { administrativeUnitsService } from '../../services/settings/administrativeUnitsService';
import { processPermissionService } from '../../services/settings/processPermissionService';
import Loader from '../../components/Loader';
import UserAddEditDialog from '../../dialogs/UserAddEditDialog';
import EditIcon from '@mui/icons-material/Edit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BadgeIcon from '@mui/icons-material/Badge'
import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog';
import { useSnackbar } from 'notistack';
import UserDisableDialog from '../../dialogs/UserDisableDialog';
import moment from 'moment';
import AlertDialog from '../../components/AlertDialog';
import ProcessPermissionDialog from '../../dialogs/ProcessPermissionDialog';
import { User } from '../../types/User';
import { Tooltip } from '@mui/material';

const columnsInit: TableColumnType[] = [
  { 
    id: "UserName", 
    label: 'Nombre de Usuario', 
    minWidth: 50 
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
    id: "WorkEmail",
    label: "Correo Electrónico",
    minWidth: 100,    
  },
  {
    id: "IsActive",
    label: "Activo",
    minWidth: 100,    
  },  
  {
    id: "Actions",
    label: "Acciones",
    minWidth: 100,    
  }
];

const emptyUserObject: User = {
  Id: -1,
  UserName: '',
  Name: '',
  MiddleName: '',
  LastName: '',
  OtherName: '',
  WorkEmail: '',
  IsActive: true
};

// const emptyContactObject = {
//   id: -1,
//   salutation: undefined,
//   name: '',
//   middleName: '',
//   lastName: '',
//   otherName: '',
//   title: undefined,
//   homeAddressLine1: '',
//   homeAddressLine2: '',
//   homeCity: '',
//   homeState: '',
//   homePostalCode: '',
//   countryId: -1,
//   workAddressLine1: '',
//   workAddressLine2: '',
//   workCity: '',
//   workState: '',
//   workPostalCode: '',
//   workCountry: '',
//   workEmail: '',
//   homeEmail: '',
//   homePhone: '',
//   workPhone: '',
//   workPhoneExt: '',
//   mobilePhone: '',
//   companyId: -1,
//   contactTypeId: -1,
//   notes: '',
//   preferredAddress: -1,
//   companyName: '',
//   website: '',
//   primaryContactId: -1,
//   isSupplier: false,
//   isDeleted: false
// };

export default function Users() {

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState<boolean>(false);
  const [columns, setColumns] = useState(columnsInit as any);
  const [rows, setRows] = useState([] as any);
  const [searchText, setSearchText] = useState<string>('');
  
  const [totalRows, setTotalRows] = useState<number>(10);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [openUserAddEditDialog, setOpenUserAddEditDialog] = useState<boolean>(false);
  const [openUserDisableDialog, setOpenUserDisableDialog] = useState<boolean>(false);
  const [openProcessPermissionDialog, setOpenProcessPermissionDialog] = useState<boolean>(false);
  
  const [openUserDeleteDialog, setOpenUserDeleteDialog] = useState<boolean>(false);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  /** Fetch Data Section */

  const fetchUsers = useCallback(async (offset: number, fetch: number, searchText: string) => {
    try {
      setLoading(true);
      
      const rowsTemp: any[] = [];
      const response = await userService.getAll(offset + 1, fetch, searchText);

      if(response.statusText === 'OK') {
        if(response.data.totalCount){
          setTotalRows(response.data.totalCount);
        }

        response.data.usersList.forEach((item: any) => {
          rowsTemp.push([
            item.userName,
            item.name,
            item.middleName,
            item.lastName,
            item.otherName,
            item.workEmail,
            item.isActive,
          ]);
        });
        
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

  const fetchUser = async (userId: number) =>{
    
    try {
      const response = await userService.get(userId);
      if(response.statusText === 'OK') {
        setLoading(false);        
        return response.data;
      }
      enqueueSnackbar('Error al obtener usuario.', { variant: 'error' });
    }
    catch{
      enqueueSnackbar('Error al obtener usuario.', { variant: 'error' });
      setLoading(false);
    }
    
    return null;
  };   

  const deleteSelectedUser = async (entityId: number, userId: number) => {

    setLoading(true);

    try {
      const response = await userService.delete(entityId, userId); 

      if (response.statusText === "OK") {
        setLoading(false);
        enqueueSnackbar('Usuario eliminado.', { variant: "success" });
      } else {
        enqueueSnackbar('Ocurrió un Error al eliminar al usuario.', { variant: "error" });
      }
    } catch (error: any) {
      enqueueSnackbar('Ocurrió un Error al eliminar al usuario.. Detalles: ' + error.message, { variant: "error" });
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

  // User Add/Edit dialog
  const handleOpenUserAddEditDialog = () => {
    setSelectedUser(emptyUserObject);
    setOpenUserAddEditDialog(true);
  }

  const handleCloseUserAddEditDialog = () => {
    setOpenUserAddEditDialog(false);
  }

  const handleCloseUserAddEditDialogFromAction = (refreshUsersList: boolean = false) => {
    if(refreshUsersList) {
      fetchUsers(currentPage, rowsPerPage, searchText);
    }
    setOpenUserAddEditDialog(false);
  }

  const handleSelectedUserEdit = async (user: any) => {
    const userData = await fetchUser(user && user[0] ? user[0] : 0);
        
    setSelectedUser(userData);
    setOpenUserAddEditDialog(true);
  }

  // User Disable dialog
  const handleOpenUserDisableDialog = async (user: any) => {
    const userData = await fetchUser(user && user[0] ? user[0] : 0);
      
    setSelectedUser(userData);
    setOpenUserDisableDialog(true);
  }

  const handleCloseUserDisableDialog = () => {
    setOpenUserDisableDialog(false);
  }

  const handleCloseUserDisableDialogFromAction = (refreshUsersList: boolean = false) => {
    if(refreshUsersList) {
      fetchUsers(currentPage, rowsPerPage, searchText);
    }
    setOpenUserDisableDialog(false);
  }
  
  // Process Permission dialog
  const handleOpenProcessPermissionDialog = async (user: any) => {
    const userData = await fetchUser(user && user[0] ? user[0] : 0);

    setSelectedUser(userData);
    setOpenProcessPermissionDialog(true);
  }

  const handleCloseProcessPermissionDialog = () => {
    setOpenProcessPermissionDialog(false);
  }

  const handleCloseProcessPermissionDialogFromAction = (actionResult: boolean = false) => {
    if(actionResult) {
      fetchUsers(currentPage, rowsPerPage, searchText);
    }
    setOpenProcessPermissionDialog(false);
  }
    

  // User Delete Alert dialog
  const handleOpenUserDeleteDialog = async (user: any) => {
    const userData = await fetchUser(user && user[0] ? user[0] : 0);
      
    setSelectedUser(userData);
    setOpenUserDeleteDialog(true);
  }

  const handleCloseUserDeleteDialog = () => {    
    setOpenUserDeleteDialog(false);
  }

  const handleCloseUserDeleteDialogFromAction = async (actionResult: boolean = false) => {
    if(actionResult) {
      await deleteSelectedUser(selectedUser.idEntidad, selectedUser.idUsuario);
      await fetchUsers(currentPage, rowsPerPage, searchText);
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
    fetchUsers(currentPage, rowsPerPage, searchText);

  }, [currentPage, rowsPerPage, searchText, fetchUsers]);

  /** Return Section */
  return (
    <>
      <Page title="Usuarios">
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
        open={openUserAddEditDialog}
        onClose={handleCloseUserAddEditDialog}
        maxWidth={"lg"}        
      >
        <UserAddEditDialog 
          mode = {selectedUser && selectedUser.idUsuario > -1 ? 'edit' : 'add'}
          selectedUser = {selectedUser}
          administrativeUnitsList = {null}
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
