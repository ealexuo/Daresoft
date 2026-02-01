import React, { useCallback, useEffect, useState } from 'react'
import {TableColumnType, StickyHeadTable, ItemActionListType} from '../../components/StickyHeadTable'
import Page from '../../components/Page'
import { usersService } from '../../services/settings/usersService';
import Loader from '../../components/Loader';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog';
import { useSnackbar } from 'notistack';
import AlertDialog from '../../components/AlertDialog';
import { Tooltip } from '@mui/material';
import { Contact } from '../../types/Contact';
import { contactsService } from '../../services/settings/contactsService';
import SupplierAddEditDialog from '../../dialogs/SupplierAddEditDialog';
import { countries } from '../../enums/Countries';

const columnsInit: TableColumnType[] = [
  {
    id: "Id", 
    label: "Id", 
    minWidth: 50,
    hidden: true
  }, 
  {
    id: "Company", 
    label: "Empresa", 
    minWidth: 150 
  },
  { 
    id: "Name", 
    label: "Nombre", 
    minWidth: 100 
  },
  { 
    id: "LastName", 
    label: "Apellido", 
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
    minWidth: 150,    
  }
];

// Empty supplier object
const emptySupplierObject: Contact = {
  id: -1,
  name: '',
  middleName: '',
  lastName: '',
  otherName: '',
  countryId: -1,
  workEmail: '',
  workPhone: '',
  workPhoneExt: '',
  mobilePhone: '',
  contactTypeId: 1,
  companyName: '',
  isSupplier: true,
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
  const [suppliersList, setSuppliersList] = useState<Contact[]>([]);
  
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

        response.data.contactsList.forEach((item: any) => {
          const countryName = item.countryId ? countries.find(c => c.id === item.countryId)?.name : '';
          rowsTemp.push([
            item.id,
            item.companyName,
            item.name,
            item.lastName,
            countryName,
            item.workEmail,
            item.workPhone,
            item.workPhoneExt,
            item.mobilePhone,
          ]);
        });

        setSuppliersList(response.data.contactsList);
        setRows(rowsTemp);
        setLoading(false);

      }
      else {
        enqueueSnackbar('Ocurrió un error al obtener la lista de proveedores.', { variant: 'error' });
      }        
    }
    catch(error: any){
      enqueueSnackbar('Ocurrió un error al obtener la lista de proveedores. Detalles: ' + error.message, { variant: 'error' });
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

  // Supplier Add/Edit dialog
  const handleOpenSupplierAddEditDialog = () => {
    setSelectedSupplier(emptySupplierObject);
    setOpenSupplierAddEditDialog(true);
  }

  const handleCloseSupplierAddEditDialog = () => {
    setOpenSupplierAddEditDialog(false);
  }

  const handleCloseSupplierAddEditDialogFromAction = (refreshSuppliersList: boolean = false) => {
    if(refreshSuppliersList) {
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
  const handleOpenSupplierDeleteDialog = async (supplier: any) => {
    const supplierTemp = suppliersList.find(s => s.id === (supplier && supplier[0] ? supplier[0] : 0));
      
    setSelectedSupplier(supplierTemp);
    setOpenSupplierDeleteDialog(true);
  }

  const handleCloseSupplierDeleteDialog = () => {    
    setOpenSupplierDeleteDialog(false);
  }

  const handleCloseSupplierDeleteDialogFromAction = async (actionResult: boolean = false) => {
    if(actionResult) { 

      setLoading(true);

      try {
        const response = await contactsService.delete(selectedSupplier.id); 

        if (response.statusText === "OK") {
          setLoading(false);
          fetchSuppliers(currentPage, rowsPerPage, searchText);
          enqueueSnackbar('Proveedor eliminado.', { variant: "success" });
        } else {
          enqueueSnackbar('Ocurrió un error al eliminar al proveedor.', { variant: "error" });
        }
      } catch (error: any) {
        enqueueSnackbar('Ocurrió un Error al eliminar al proveedor. Detalles: ' + error.message, { variant: "error" });
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
      icon: <Tooltip title="Editar Proveedor" arrow placement="top-start">
              <EditIcon />
            </Tooltip>,
      callBack: handleSelectedUserEdit, 
    },    
    { 
      name: 'delete',
      icon: <Tooltip title="Eliminar Proveedor" arrow placement="top-start">
              <DeleteIcon />
            </Tooltip>,
      callBack: handleOpenSupplierDeleteDialog, 
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
              addActionRoute={"/settings/suppliers/add-supplier"}
              addActionText="Nuevo Proveedor"
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRows={totalRows}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSearchTextChange={handleSearchTextChange}
              searchTextValue={searchText}
              onAddActionClick={handleOpenSupplierAddEditDialog}
              itemActionList={actionList}
              isCollapsible={false}
            ></StickyHeadTable>
          )
        }
      </Page>

      <Dialog
        open={openSupplierAddEditDialog}
        onClose={handleCloseSupplierAddEditDialog}
        maxWidth={"md"}        
      >
        <SupplierAddEditDialog 
          mode = {selectedSupplier && selectedSupplier.id > -1 ? 'edit' : 'add'}
          selectedSupplier = {selectedSupplier}
          onClose = {handleCloseSupplierAddEditDialogFromAction}
        />        
      </Dialog>

      <Dialog
        open={openSupplierDeleteDialog}
        onClose={handleCloseSupplierDeleteDialog}
        maxWidth={"sm"}
      >
        <AlertDialog
          color = {'error'}
          title = {'Eliminar proveedor'}
          message = {'Está seguro que desea eliminar el proveedor ' + (selectedSupplier ? selectedSupplier.name : '') + '?'}
          onClose = {handleCloseSupplierDeleteDialogFromAction}
        />
      </Dialog>
          
    </>    
  );
}
