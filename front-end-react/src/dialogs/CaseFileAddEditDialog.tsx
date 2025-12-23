import React, { useCallback, useEffect, useState } from 'react'
import {
    DialogContent, DialogTitle, DialogActions, Button, Grid, TextField, Autocomplete, Box,
    ToggleButtonGroup,
    ToggleButton
} from "@mui/material"
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useSnackbar } from 'notistack'
import { Proceso } from '../types/Proceso'
import { Origen } from '../types/Origen'
import { fileService } from '../services/files/fileService';
import { CaseFile } from '../types/CaseFile'
import { contactsService } from '../services/settings/contactsService'
import { Contact } from '../types/Contact'
import { useTranslation } from 'react-i18next';

// Date Picker Dependencies
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import moment from 'moment';
import 'moment/locale/es';

type DialogProps = {
    mode: 'add'|'edit',
    selectedCaseFile: CaseFile,
    onClose: (refresh: boolean) => void    
}

// type File = {
//     idProceso: number;
//     idOrigen: number;
//     emisor: string;
//     descripcion: string;
// }

export default function CaseFileAddEditDialog({ mode, selectedCaseFile, onClose }: DialogProps) {
    
    const { enqueueSnackbar } = useSnackbar();
    const [t] = useTranslation();
    
    const [loading, setLoading] = useState<boolean>(false);
    const [suppliersList, setSupliersList] = useState<Contact[]>([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number>(0);
    const [entryDate, setEntryDate] = useState<moment.Moment>(moment());

    const formSchema = z.object({
        Proceso: z.custom<Proceso>((val) => val !== null, {
            message: "Campo requerido",
        }),
        Origen: z.custom<Proceso>((val) => val !== null, {
            message: "Campo requerido",
        }),
        emisor: z.string().min(1, "Campo requerido"),
        descripcion: z.string().min(1, "Campo requerido").max(500, "Máximo 500 caracteres"),        
        supplier: z.string().min(1, t("errorMessages.requieredField")),
        
    })

    type FileFormType = {
        Proceso: Proceso | null;
        Origen: Origen | null;
        emisor: string;
        descripcion: string;
        supplier: Contact | null;
    }

    const defaultValues: FileFormType = {
        Proceso: null,
        Origen: null,
        emisor: '',
        descripcion: '',
        supplier: null
    }

    const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FileFormType>({
        resolver: zodResolver(formSchema),
        defaultValues,
        mode: 'onTouched'
    })

    const onSubmit: SubmitHandler<FileFormType> = async (formData) => {

        // if (!formData.Proceso || !formData.Origen) return;

        // const fileObject: File = {
        //     idProceso: formData.Proceso?.idProceso,
        //     idOrigen: formData.Origen?.idOrigen,
        //     emisor: formData.emisor,
        //     descripcion: formData.descripcion
        // };
        // try {
        //     await fileService.add(fileObject);
        //     enqueueSnackbar("Expediente creado exitosamente", { variant: "success" })
        //     onClose(true)
        // } catch (error) {
        //     enqueueSnackbar("Error al crear expediente", { variant: "error" })
        // }
    }

    const safeNombre = (option: any) =>
        typeof option === 'object' && option !== null && 'nombre' in option ? option.nombre : '';


    const [alignment, setAlignment] = React.useState('web');

    const handleToggleButtonChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setAlignment(newAlignment);
    };


    /** Fetch Data Section */
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

    useEffect(()=>{
        fetchSuppliers();
    }, [fetchSuppliers])

    return (
        <form onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log("Errores del formulario:", errors);
        })}>
            <DialogTitle>Datos del Expediente</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1, mb: 2, fontSize: 12, color: '#666' }}>
                    Los campos marcados con (*) son obligatorios.
                </Box>
                <Grid container spacing={2}>
                    {/* <Grid item xs={12} sm={12}>
                        <ToggleButtonGroup
                            color="primary"
                            value={alignment}
                            exclusive
                            onChange={handleToggleButtonChange}
                            aria-label="Platform"
                            >
                            <ToggleButton value="web">Laboratorio Nacional de Salud (LNS)</ToggleButton>
                            <ToggleButton value="android">Ministry of Health (MOH)</ToggleButton>                            
                        </ToggleButtonGroup>
                    </Grid> */}
                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            disablePortal
                            id="suppliersList"
                            options={suppliersList}
                            isOptionEqualToValue={(option: any, value: any) => option.name === value.name}
                            defaultValue={suppliersList[0]}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="* Proveedor"
                                    {...register("supplier")}
                                    error = { errors.supplier?.message ? true : false }
                                    helperText= { errors.supplier?.message }
                                />
                            )}                      
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                views={['year', 'month', 'day']}
                                label="* Fecha de ingreso"
                                name="entryDate"
                                value={entryDate}
                                slotProps={{ textField: { fullWidth: true } }}
                                onChange={(newDate) => setEntryDate(newDate || moment())}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="* Producto"                            
                            fullWidth
                            type='text'
                            inputProps={{ maxLength: 500 }}                                                
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Número de Entrada SIAD"                            
                            fullWidth
                            type='number'
                            inputProps={{ maxLength: 500 }}                            
                        />                        
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Llave"                            
                            fullWidth
                            type='text'
                            inputProps={{ maxLength: 500 }}                            
                        />
                    </Grid>
                    
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => { onClose(false) }}>
                    Cancelar
                </Button>
                <Button variant="contained" type="submit" disableElevation disabled={isSubmitting}>
                    {isSubmitting ? "Guardando..." : "Crear"}
                </Button>
            </DialogActions>
        </form>
    )
}
