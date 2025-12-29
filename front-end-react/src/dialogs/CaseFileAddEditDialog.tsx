import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import {
    DialogContent, DialogTitle, DialogActions, Button, Grid, TextField, Autocomplete, Box,
    ToggleButtonGroup,
    ToggleButton,
    styled,
    selectClasses,
    Divider,
    Typography,
    Paper,
    useTheme, 
    Theme,
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

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Task } from '../types/Task'
import { Document } from '../types/Document'
import { CaseFileWorkflow } from '../types/CaseFileWorkflow'
import { caseFilesService } from '../services/settings/caseFilesService'
import { ThemeContext, ThemeProvider } from '@emotion/react'
import UploadFileIcon from '@mui/icons-material/UploadFile';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

type WorkflowType = 'both' | 'lns' | 'moh';

type DialogProps = {
    mode: 'add'|'edit',
    selectedCaseFile: CaseFile | undefined,
    onClose: (refresh: boolean) => void    
}

// type File = {
//     idProceso: number;
//     idOrigen: number;
//     emisor: string;
//     descripcion: string;
// }

type SupplierListData = {
    id: number;
    label: string;        
};

export default function CaseFileAddEditDialog({ mode, selectedCaseFile, onClose }: DialogProps) {
    
    const { enqueueSnackbar } = useSnackbar();
    const [t] = useTranslation();
    const theme = useTheme();
    
    const [loading, setLoading] = useState<boolean>(false);
    const [suppliersList, setSupliersList] = useState<SupplierListData[]>([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number>(0);
    const [entryDateMOH, setEntryDateMOH] = useState<moment.Moment>(moment());
    const [entryDateLNS, setEntryDateLNS] = useState<moment.Moment>(moment());

    const [workflow, setWorkflow] = useState<WorkflowType>('both');

    const [documentLNS, setDocumentLNS] = useState<File | null>(null);
    const [documentMOH, setDocumentMOH] = useState<File | null>(null);

    const [uploadStatusLNS, setUploadStatusLNS] = useState<UploadStatus>('idle');
    const [uploadStatusMOH, setUploadStatusMOH] = useState<UploadStatus>('idle');

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    if(!selectedCaseFile) {
        selectedCaseFile = {
            id: -1,
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
            totalCount: 0
        }
    }

    // Form Schema definition
    const formSchema = z.object({
        supplierName: z.string(),
        name: z.string(),       
        MOHEntry: z.string(),
        MOHKey: z.string(),
        LNSEntry: z.string(),
        LNSKey: z.string(),        
    });

    // Form Schema Type
    type CaseFileFormType = z.infer<typeof formSchema>;
    
    // Form Hook
    const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CaseFileFormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            supplierName: '',
            name: '',
            MOHEntry: '',
            MOHKey: '',
            LNSEntry: '',
            LNSKey: '',
        }
    })

    const handleWorkflowChange = (
        event: React.MouseEvent<HTMLElement>,
        newValue: WorkflowType
    ) => {
        setWorkflow(newValue);
    };

    const handleDocumentChangeMOH = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            setDocumentMOH(e.target.files[0]);
        }
    };

    const handleDocumentChangeLNS = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            setDocumentLNS(e.target.files[0]);
        }
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
    }, [fetchSuppliers]);

    // For Submit Logic
    const onSubmit: SubmitHandler<CaseFileFormType> = async (formData) => {

        const selectedSupplierTemp = suppliersList.find(s => s.label === formData.supplierName);

        const workflowLNS: CaseFileWorkflow = {
            id: 0,
            caseFileId: 0,
            caseFileName: '',
            workflowId: 1,
            workflowName: '',
            workflowStatusId: 1,
            statusName: '',
            externalIdentifier: formData.LNSEntry + '|' + formData.LNSKey,
            startDate: entryDateLNS.toDate(),
            endDate: null
        }

        const workflowMOH: CaseFileWorkflow = {
            id: 0,
            caseFileId: 0,
            caseFileName: '',
            workflowId: 2,
            workflowName: '',
            workflowStatusId: 1,
            statusName: '',
            externalIdentifier: formData.MOHEntry + '|' + formData.MOHKey,
            startDate: entryDateMOH.toDate(),
            endDate: null
        }
        
        const entryDocumentMOH: Document = {
            id: 0,
            caseFileId: 0,
            name: documentMOH ? documentMOH.name : '',
            path: 'MOH',
            contentType: documentMOH ? documentMOH.type : '',
            size: documentMOH ? documentMOH.size : 0
        }

        const entryDocumentLNS: Document = {
            id: 0,
            caseFileId: 0,
            name: documentLNS ? documentLNS.name : '',
            path: 'LNS',
            contentType: documentLNS ? documentLNS.type : '',
            size: documentLNS ? documentLNS.size : 0
        }

        const caseFileToSave: CaseFile = {
            id: 0,
            caseNumber: '',
            name: formData.name,
            description: '',
            supplierContactId: selectedSupplierTemp ? selectedSupplierTemp.id : 0,
            supplierName: '',
            supplierLastName: '',
            isActive: true,
            isDeleted: false,
            workflows: [workflowMOH, workflowLNS],
            tasks: [],
            documents: [entryDocumentMOH, entryDocumentLNS],            
            totalCount: 0
        }

        try {
            const caseFileResponse = await caseFilesService.add(caseFileToSave);
            // todo save and upload document
            
            enqueueSnackbar("Expediente creado exitosamente", { variant: "success" })
            onClose(true)
        } catch (error) {
            enqueueSnackbar("Error al crear expediente.", { variant: "error" })
        }
    }
   
    return (
        <form onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log("Errores del formulario:", errors);
        })}>
            <DialogTitle>Datos del Expediente</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1, mb: 2, fontSize: 12, color: '#666' }}>
                    Los campos marcados con (*) son obligatorios.
                </Box>

                <Typography variant="subtitle1">
                    Información general
                </Typography>

                {/* <Grid item xs={12} sm={12}>
                        <ToggleButtonGroup
                            color="primary"
                            value={workflow}
                            exclusive
                            onChange={handleWorkflowChange}
                            aria-label="Workflow"
                            >
                            <ToggleButton value="both">Ambos LNS y MOH</ToggleButton>
                            <ToggleButton value="lns">Solo LNS</ToggleButton>
                            <ToggleButton value="moh">Solo MOH</ToggleButton>                            
                        </ToggleButtonGroup>
                    </Grid> */}

                <Paper
                    variant="outlined"
                    sx={{ my: { xs: 2, md: 2 }, p: { xs: 2, md: 3 } }}
                >
                    <Grid container spacing={2}>
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
                                        {...register("supplierName")}
                                        error = { errors.supplierName?.message ? true : false }
                                        helperText= { errors.supplierName?.message }
                                    />
                                )}                      
                            />
                        </Grid>                        
                        <Grid item xs={12}>
                            <TextField
                                label="* Producto"                            
                                fullWidth
                                type='text'
                                inputProps={{ maxLength: 500 }}
                                {...register("name")}
                            />
                        </Grid>
                    </Grid>                    
                </Paper>
                
                <Typography variant="subtitle1">
                    Ministry of Health (MOH)
                </Typography>

                <Paper
                    variant="outlined"
                    sx={{ my: { xs: 2, md: 2 }, p: { xs: 2, md: 3 } }}
                >                    
                    <Grid container spacing={2}>                        
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Número de Entrada SIAD"                            
                                fullWidth
                                type='number'
                                inputProps={{ maxLength: 500 }}
                                {...register("MOHEntry")}
                            />                        
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Llave"                            
                                fullWidth
                                type='text'
                                inputProps={{ maxLength: 500 }}
                                {...register("MOHKey")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    views={['year', 'month', 'day']}
                                    label="* Fecha de ingreso"
                                    name="entryDate"
                                    value={entryDateMOH}
                                    slotProps={{ textField: { fullWidth: true } }}
                                    onChange={(newDate) => setEntryDateMOH(newDate || moment())}                                
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                component="label"
                                role={undefined}
                                variant="outlined"
                                tabIndex={-1}
                                startIcon={<UploadFileIcon />}                                
                                >
                                Agregar documento
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={handleDocumentChangeMOH}
                                    multiple
                                />
                            </Button>
                            {
                                documentMOH && (
                                    <div>
                                        <p style={{fontSize: '14px', paddingTop: 0, marginTop: 5}}>Documento seleccionado: {documentMOH.name}</p>
                                        {/* <p>Size: {(document.size / 1024).toFixed(2)} KB</p>
                                        <p>Type: {document.type}</p> */}
                                    </div>
                                )
                            }
                        </Grid>                        
                    </Grid>
                </Paper>

                <Typography variant="subtitle1">
                    Laboratorio Nacional de Salud (LNS)
                </Typography>

                <Paper
                    variant="outlined"
                    sx={{ my: { xs: 2, md: 2 }, p: { xs: 2, md: 3 } }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Número de Entrada SIAD"                            
                                fullWidth
                                type='number'
                                inputProps={{ maxLength: 500 }}
                                {...register("LNSEntry")}
                            />                        
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Llave"                            
                                fullWidth
                                type='text'
                                inputProps={{ maxLength: 500 }}
                                {...register("LNSKey")}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                    views={['year', 'month', 'day']}
                                    label="* Fecha de ingreso"
                                    name="entryDate"
                                    value={entryDateMOH}
                                    slotProps={{ textField: { fullWidth: true } }}
                                    onChange={(newDate) => setEntryDateLNS(newDate || moment())}                                
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                component="label"
                                role={undefined}
                                variant="outlined"
                                tabIndex={-1}
                                startIcon={<UploadFileIcon />}
                                >
                                Agregar documento
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={handleDocumentChangeLNS}
                                    multiple
                                />
                            </Button>
                            {
                                documentLNS && (
                                    <div>
                                        <p style={{fontSize: '14px', paddingTop: 0, marginTop: 5}}>Documento seleccionado: {documentLNS.name}</p>
                                        {/* <p>Size: {(document.size / 1024).toFixed(2)} KB</p>
                                        <p>Type: {document.type}</p> */}
                                    </div>
                                )
                            }
                        </Grid> 
                    </Grid>
                </Paper>                

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
