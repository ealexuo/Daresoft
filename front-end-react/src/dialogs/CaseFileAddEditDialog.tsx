import React, { ChangeEvent, useState } from 'react'
import {
    DialogContent, DialogTitle, DialogActions, Button, Grid, TextField, Autocomplete, Box,    
    styled,    
    Typography,
    Paper,
} from "@mui/material"
import { useForm, SubmitHandler } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useSnackbar } from 'notistack'
import { CaseFile } from '../types/CaseFile'
import { useTranslation } from 'react-i18next';

// Date Picker Dependencies
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import moment from 'moment';
import 'moment/locale/es';

import { Document } from '../types/Document'
import { CaseFileWorkflow } from '../types/CaseFileWorkflow'
import { caseFilesService } from '../services/settings/caseFilesService'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { AutoCompleteData } from '../types/AutoCompleteData'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

type DialogProps = {
    mode: 'add'|'edit',
    selectedCaseFile: CaseFile | undefined,
    suppliersList: AutoCompleteData[],
    onClose: (refresh: boolean) => void    
}

export default function CaseFileAddEditDialog({ mode, selectedCaseFile, suppliersList, onClose }: DialogProps) {
    
    const { enqueueSnackbar } = useSnackbar();
    const [t] = useTranslation();
    
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number>(0);   

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

    type formType = {
        supplierName: string,
        supplierContactId: number;
        name: string,
        MOHEntry: string,
        MOHKey: string,
        LNSEntry: string,
        LNSKey: string,   
    }

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
            createdDate: new Date(),
            totalCount: 0
        }
    }
    
    const workflowMOH = selectedCaseFile.workflows ? selectedCaseFile.workflows.find(w => w.workflowId === 2) : undefined;
    const workflowLNS = selectedCaseFile.workflows ? selectedCaseFile.workflows.find(w => w.workflowId === 1) : undefined; 
    
    const MOHExternalIdentifier = workflowMOH ? workflowMOH.externalIdentifier : undefined;
    const LNSExternalIdentifier = workflowLNS ? workflowLNS.externalIdentifier : undefined;

    const entryDocumentMOH = selectedCaseFile.documents ? selectedCaseFile.documents.find(d => d.path.includes('/MOH/Entry/')) : undefined;
    const entryDocumentLNS = selectedCaseFile.documents ? selectedCaseFile.documents.find(d => d.path.includes('/LNS/Entry/')) : undefined;

    const [entryDateMOH, setEntryDateMOH] = useState<moment.Moment>(workflowMOH ? moment(workflowMOH.createdDate) : moment());
    const [entryDateLNS, setEntryDateLNS] = useState<moment.Moment>(workflowLNS ? moment(workflowLNS.createdDate) : moment());

    const [documentLNS, setDocumentLNS] = useState<File | null>(entryDocumentMOH ? new File([], entryDocumentMOH.name) : null);
    const [documentMOH, setDocumentMOH] = useState<File | null>(entryDocumentLNS ? new File([], entryDocumentLNS.name) : null);

    let formDefaultValues: formType;

    formDefaultValues = {     
        supplierName: suppliersList.find(s => s.id === selectedCaseFile?.supplierContactId)?.label ?? '',
        supplierContactId: selectedCaseFile.supplierContactId,
        name: selectedCaseFile.name,
        MOHEntry: MOHExternalIdentifier ? MOHExternalIdentifier.split('|')[0] : '',
        MOHKey: MOHExternalIdentifier ? MOHExternalIdentifier.split('|')[1] : '',
        LNSEntry: LNSExternalIdentifier ? LNSExternalIdentifier.split('|')[0] : '',
        LNSKey: LNSExternalIdentifier ? LNSExternalIdentifier.split('|')[1] : '',
    };    

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
    type CaseFileFormType = formType;
    
    // Form Hook
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CaseFileFormType>({
        resolver: zodResolver(formSchema),
        defaultValues: formDefaultValues
    })

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

    // For Submit Logic
    const onSubmit: SubmitHandler<CaseFileFormType> = async (formData) => {

        const selectedSupplierTemp = suppliersList.find(s => s.label === formData.supplierName);

        const workflowMOHTemp: CaseFileWorkflow = {
            id: workflowMOH ? workflowMOH.id : 0,
            caseFileId: workflowMOH ? workflowMOH.caseFileId : 0,
            caseFileName: workflowMOH ? workflowMOH.caseFileName : '',
            workflowId: workflowMOH ? workflowMOH.workflowId : 1,
            workflowName: workflowMOH ? workflowMOH.workflowName : '',
            workflowStatusId: workflowMOH ? workflowMOH.workflowStatusId : 1,
            workflowStatusName: workflowMOH ? workflowMOH.workflowStatusName : '',
            externalIdentifier: formData.MOHEntry + '|' + formData.MOHKey,
            startDate: entryDateMOH.toDate(),
            createdDate: entryDateMOH.toDate(),
            endDate: null
        }

        const workflowLNSTemp: CaseFileWorkflow = {
            id: workflowLNS ? workflowLNS.id : 0,
            caseFileId: workflowLNS ? workflowLNS.caseFileId : 0,
            caseFileName: workflowLNS ? workflowLNS.caseFileName : '',
            workflowId: workflowLNS ? workflowLNS.workflowId : 1,
            workflowName: workflowLNS ? workflowLNS.workflowName : '',
            workflowStatusId: workflowLNS ? workflowLNS.workflowStatusId : 1,
            workflowStatusName: workflowLNS ? workflowLNS.workflowStatusName : '',
            externalIdentifier: formData.LNSEntry + '|' + formData.LNSKey,
            startDate: entryDateLNS.toDate(),
            createdDate: entryDateLNS.toDate(),
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
            id: selectedCaseFile ? selectedCaseFile.id : 0,
            caseNumber: selectedCaseFile ? selectedCaseFile.caseNumber : '',
            name: formData.name,
            description: selectedCaseFile ? selectedCaseFile.description : '',
            supplierContactId: selectedSupplierTemp ? selectedSupplierTemp.id : 0,
            supplierName: '',
            supplierLastName: '',
            isActive: true,
            isDeleted: false,
            workflows: [workflowMOHTemp, workflowLNSTemp],
            tasks: [],
            documents: [entryDocumentMOH, entryDocumentLNS],            
            totalCount: 0
        }

        try {
            if (mode === "add") {
                const caseFileResponse = await caseFilesService.add(caseFileToSave);
                // todo save and upload document                
                enqueueSnackbar("Expediente creado.", { variant: "success" });

            } else {
                const caseFileResponse = await caseFilesService.edit(caseFileToSave);
                // todo save and upload document
                enqueueSnackbar("Expediente actualizado.", { variant: "success" });
            }           
            onClose(true);

        } catch (error: any) {
             if (error.response?.data) {
            enqueueSnackbar(error.response.data, { variant: "error" });
          } else {
            enqueueSnackbar(error.response.data, { variant: "error" });
          }
        }
    }
   
    return (
        <form onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log("Errores del formulario:", errors);
        })}>
            <DialogTitle>Datos del expediente</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1, mb: 2, fontSize: 12, color: '#666' }}>
                    Los campos marcados con (*) son obligatorios.
                </Box>

                <Typography variant="subtitle1">
                    Información general
                </Typography>

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
                                defaultValue={suppliersList.find(s => s.id === selectedCaseFile?.supplierContactId)}
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
                                    value={entryDateLNS}
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
                    {isSubmitting ? "Guardando..." : mode === 'add' ? 'Ingresar' : 'Actualizar'}
                </Button>
            </DialogActions>
        </form>
    )
}
