import React, { useCallback, useEffect, useState } from 'react'

// General Dependencies
import {
  DialogContent,
  DialogTitle,
  DialogContentText,
  Box,
  DialogActions,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  Checkbox,
  Autocomplete,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Fab,
  Dialog,
} from "@mui/material";

// React Form Dependencies
import { useTranslation } from 'react-i18next';

// Toastr Dependencies
import { useSnackbar } from 'notistack';
import { Fase } from '../types/Fase';
import { Proceso } from '../types/Proceso';
import { administrativeUnitsService } from '../services/settings/administrativeUnitsService';
//import { userService } from '../services/settings/usersService';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { workflowPhaseService } from '../services/settings/workflowPhaseService';
import AlertDialog from '../components/AlertDialog';

// Dialog parameters Type
type DialogProps = {
    selectedPhase: Fase | undefined,
    selectedWorkflow: Proceso,
    onClose: (refreshSectionsList: boolean) => void
}

// Other global variables

export default function WorkflowPhaseUsersDialog({selectedPhase, selectedWorkflow, onClose}: DialogProps) {
    // Local constants or varialbes
    const [t] = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState<boolean>(false);
    const [administrativeUnitsList, setAdministrativeUnitslist] = useState<any>([]);
    const [usersList, setUsersList] = useState<any[]>([]);
    const [assignedUsersList, setAssignedUsersList] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>();
    const [openPhaseUserDeleteDialog, setOpenPhaseUserDeleteDialog] = useState<boolean>(false);
    const [selectedAssignedUserId, setSelectedAssignedUserId] = useState<number>(0);

    if (!selectedPhase) {
        selectedPhase = {
            idEntidad: selectedWorkflow ? selectedWorkflow.idEntidad : 0,
            idProceso: selectedWorkflow ? selectedWorkflow.idProceso : 0,
            idFase: 0,
            idTipoFase: 1,
            tipoFase: '',
            idUnidadAdministrativa: 1,
            unidadAdministrativa: '',
            nombre: '',
            descripcion: '',
            tiempoPromedio: 0,
            idUnidadMedida: 0,
            unidadMedida: '',
            asignacionObligatoria: false,
            activa: false,
            acuseRecibido: false,
            idTipoAcceso: 1,
            tipoAcceso: '',
            usuarioRegistro: 0,
            fechaRegistro: new Date(),
            listaTransiciones: [],
        };
    }
        
    const handleAddAssignedUser = async () => {
        setLoading(true);

        try{
            if (selectedUser) {
                const response = await workflowPhaseService.addPhaseUser({
                    idEntidad: selectedPhase ? selectedPhase.idEntidad : 0,
                    idProceso: selectedPhase ? selectedPhase.idProceso : 0,
                    idFase: selectedPhase ? selectedPhase.idFase : 0,
                    idUsuario: selectedUser.id,
                    recepcionTraslado: false,
                    nombre: selectedUser.label,
                    usuarioRegistro: 0,
                    fechaRegistro: new Date(),
                });
    
                if(response.statusText === 'OK') {
                    fetchUsersData();            
                    setSelectedUser(null);                    
                    enqueueSnackbar('Usuario asignado correctamente.', { variant: 'success' });
                }
                else {
                    enqueueSnackbar('Ocurrió un Error al asignar el usuario.', { variant: 'error' });
                }            
            }
        }
        catch(error: any){
            enqueueSnackbar('Ocurrió un Error al asignar el usuario. Detalles: ' + error.message, { variant: 'error' });    
        }

        setLoading(false);    
    };

    const handleDeleteAssignedUser = async (userId: number) => {
        setSelectedAssignedUserId(userId);
        setOpenPhaseUserDeleteDialog(true);
    }

    const handleRecieveDocumentsChange = async (event: any, user: any) => {
        setLoading(true);

        try{
            const response = await workflowPhaseService.updateReceptionPhaseUser({
                idEntidad: selectedPhase ? selectedPhase.idEntidad : 0,
                idProceso: selectedPhase ? selectedPhase.idProceso : 0,
                idFase: selectedPhase ? selectedPhase.idFase : 0,
                idUsuario: user.idUsuario,
                recepcionTraslado: event.target.checked,
                nombre: user.nombre,
                usuarioRegistro: 0,
                fechaRegistro: new Date(),
            });

            if(response.statusText === 'OK') {
                fetchUsersData();            
                setSelectedUser(null);                    
                enqueueSnackbar('Usuario actualizado correctamente.', { variant: 'success' });
            }
            else {
                enqueueSnackbar('Ocurrió un error al actualizar al usuario.', { variant: 'error' });
            } 
        }
        catch(error: any){
            enqueueSnackbar('Ocurrió un error al actualizar al usuario. Detalles: ' + error.message, { variant: 'error' });    
        }

        setLoading(false);    
    };

    const fetchAdministrativeUnits = useCallback(async () =>{
        setLoading(true);

        try {
            const response = await administrativeUnitsService.getAll();
            if(response.statusText === 'OK') {
                const administrativeUnits = response.data;
                setAdministrativeUnitslist(administrativeUnits.map((ua: any) => {
                    return { 
                        id: ua.idUnidadAdministrativa, label: ua.nombre
                    }
                }));
            }
            else {
                enqueueSnackbar('Ocurrió un Error al obtener las unidades administrativas.', { variant: 'error' });
            }        
        }
        catch(error: any){
            enqueueSnackbar('Ocurrió un Error al obtener las unidades administrativas. Detalles: ' + error.message, { variant: 'error' });
        }
        
        setLoading(false);    
    }, [enqueueSnackbar]);

    const fetchUsers = useCallback(async (initialPage: number, usersPerPage: number, searchString: string) => {
        setLoading(true);

        try {
            // const response = await userService.getAll(initialPage + 1, usersPerPage, searchString);
            // if(response.statusText === 'OK') {
            //     setUsersList(response.data.listaUsuarios.map((u: any) => {
            //         return { 
            //             id: u.idUsuario, label: u.nombre
            //         }
            //     }).sort((a: any, b: any) => a.label.localeCompare(b.label)));
            // }
            // else {
            //     enqueueSnackbar('Ocurrió un error al obtener los usuarios.', { variant: 'error' });
            // }        
        }
        catch(error: any){
            enqueueSnackbar('Ocurrió un error al obtener los usuarios. Detalles: ' + error.message, { variant: 'error' });
        }

        setLoading(false);
    }, [enqueueSnackbar]);

    const fetchAssignedUsers = useCallback(async () => {

        if(!selectedPhase) {
            return;
        }

        setLoading(true);

        try {
            const response = await workflowPhaseService.getPhaseUsers(selectedPhase.idProceso, selectedPhase.idFase);
            if(response.statusText === 'OK') {
                setAssignedUsersList(response.data.map((u: any) => {
                    return { 
                        idUsuario: u.idUsuario, nombre: u.nombre, recepcionTraslado: u.recepcionTraslado
                    }
                }).sort((a: any, b: any) => a.nombre.localeCompare(b.nombre)));
            }
            else {
                enqueueSnackbar('Ocurrió un Error al obtener los usuarios asignados.', { variant: 'error' });
            }        
        }
        catch(error: any){
            enqueueSnackbar('Ocurrió un Error al obtener los usuarios asignados. Detalles: ' + error.message, { variant: 'error' });            
        }

        setLoading(false);
    }, [enqueueSnackbar, selectedPhase]);

    const fetchUsersData = useCallback(async () => {
        
        await fetchUsers(0, 1000, '');        
        await fetchAssignedUsers();          
        
    }, [fetchUsers, fetchAssignedUsers]);

    // Dialog Actions    
    const handleClosePhaseUserDeleteDialog = () => {
        setOpenPhaseUserDeleteDialog(false);
    };

    const handleClosePhaseUserDeleteDialogFromAction = async (actionResult: boolean) => {
        if(actionResult) {
            setLoading(true);

            try{
                const response = await workflowPhaseService.deletePhaseUser(
                    selectedPhase ? selectedPhase.idProceso : 0, 
                    selectedPhase ? selectedPhase.idFase : 0, 
                    selectedAssignedUserId
                );

                if(response.statusText === 'OK') {
                    fetchUsersData();            
                    enqueueSnackbar('Usuario desasignado correctamente.', { variant: 'success' });
                }
                else {
                    enqueueSnackbar('Ocurrió un error al desasignar al usuario.', { variant: 'error' });
                }
            }
            catch(error: any){
                enqueueSnackbar('Ocurrió un error al desasignar al usuario. Detalles: ' + error.message, { variant: 'error' });    
            }

            setLoading(false);
        }       

        setOpenPhaseUserDeleteDialog(false);
    };

    useEffect (() => {        
        
        fetchAdministrativeUnits();
        fetchUsersData();

    }, [fetchAdministrativeUnits, fetchUsersData]);

    useEffect(() => {

        setUsersList((prevUsers) =>
            prevUsers.filter(
                (user) => !assignedUsersList.some((assigned) => assigned.idUsuario === user.id)
            )
        );
        
    }, [assignedUsersList]); 

    return (
        <>
            <DialogTitle>{"Configuración de usarios por fase"}</DialogTitle>
            <DialogContent>
            <DialogContentText>Los usuarios motrados en el listado pertenecen a la fase. Para asociar a un usuario, debe buscarlo por nombre.</DialogContentText>
            <Box sx={{ my: 3 }}>
                <Typography variant="subtitle1"></Typography>
                <Paper
                variant="outlined"
                sx={{ my: { xs: 2, md: 2 }, p: { xs: 2, md: 3 } }}
                >
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Proceso"
                                fullWidth
                                variant="standard"
                                value={selectedWorkflow?.nombre}
                                disabled={true}                        
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                disablePortal
                                id="unidadAdministrativa"
                                options={administrativeUnitsList}
                                isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                                defaultValue={selectedPhase?.unidadAdministrativa}
                                disabled={true}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Unidad Administrativa"
                                        variant="standard"
                                        value={selectedPhase?.unidadAdministrativa}                                    
                                        disabled={true}
                                    />
                                )}                      
                            />
                        </Grid>                    
                        <Grid item xs={12}>
                            <TextField
                                label="Fase"
                                fullWidth
                                variant="standard"
                                value = {selectedPhase?.nombre}
                                disabled={true}                        
                            />
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            <Autocomplete
                                disablePortal
                                id="usuario"
                                options={usersList}
                                isOptionEqualToValue={(option: any, value: any) => option.name === value.name} 
                                getOptionLabel={(option) => option.label || ''}
                                value={selectedUser || null}
                                onChange={(event, newValue) => { 
                                    setSelectedUser(newValue);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="* Usuario"
                                        variant="standard"                                    
                                    />
                                )}                      
                            />
                        </Grid>              
                        <Grid item xs={12} sm={2}>
                            <Tooltip title={'Asignar Usuario'}>
                                <Fab size="small" color="primary" aria-label="add">
                                    <AddIcon onClick={handleAddAssignedUser} />
                                </Fab>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={12}>                            
                            <TableContainer component={Paper} sx={{ marginTop: 5 }}>
                                <Table stickyHeader aria-label="collapsible table" size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            align={"left"}
                                            style={{ minWidth: 100 }}
                                            >
                                            <b>Nombre</b>
                                        </TableCell>
                                        <TableCell
                                            align={"left"}
                                            style={{ minWidth: 100 }}
                                            >
                                            <b>Recibe Expedientes</b>
                                        </TableCell>
                                        <TableCell
                                            align={"left"}
                                            style={{ minWidth: 100 }}
                                            >
                                            <b>Acciones</b>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        assignedUsersList?.map((row, index) => (
                                            <TableRow hover key={index} sx={{}}>
                                                <TableCell>
                                                    {row.nombre}
                                                </TableCell>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={row.recepcionTraslado}
                                                        onChange={(event) => handleRecieveDocumentsChange(event, row)}
                                                    />
                                                </TableCell>

                                                <TableCell>                                        
                                                    <IconButton onClick={() => handleDeleteAssignedUser(row.idUsuario)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>                       
                    </Grid>
                </Paper>
            </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    onClick={() => {
                    onClose(false);
                    }}
                >
                    Cerrar
                </Button>            
            </DialogActions>

            <Dialog
                open={openPhaseUserDeleteDialog}
                onClose={handleClosePhaseUserDeleteDialog}
                maxWidth={"sm"}
                >
                <AlertDialog
                    color={"error"}
                    title={"Desasignar usuario"}
                    message={
                    "Está seguro que desea desasignar al usuario seleccionado ?"
                    }
                    onClose={handleClosePhaseUserDeleteDialogFromAction}
                />
            </Dialog>
        </>
    );
}
