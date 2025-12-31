import React, { ChangeEvent, useState } from 'react'
import {
    DialogContent, DialogTitle, DialogActions, Button, Grid, TextField, Autocomplete, Box,
    ToggleButtonGroup,
    ToggleButton,
    styled
} from "@mui/material"
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useSnackbar } from 'notistack'
import { Proceso } from '../types/Proceso'
import { Origen } from '../types/Origen'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { CaseFile } from '../types/CaseFile'
import moment from 'moment'
import { useTranslation } from 'react-i18next';
import { Task } from '../types/Task'
import { tasksService } from '../services/settings/tasksService'

type DialogProps = {
    selectedCaseFile: CaseFile | undefined,
    onClose: (refresh: boolean) => void    
}

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

export default function CaseFileNoteAddEditDialog({ selectedCaseFile, onClose }: DialogProps) {

    const [t] = useTranslation();    
    const { enqueueSnackbar } = useSnackbar()
    const [document, setDocument] = useState<File | null>(null);
    const [entryDate, setEntryDate] = useState<moment.Moment>(moment());
    const [workflowId, setWorkflowId] = useState<number>(1);

    const formSchema = z.object({
        reviewer: z.string(),        
        description: z.string().min(1, t("errorMessages.requieredField")),
        months: z.number(),
    });

    // Form Schema Type
    type NoteFormType = z.infer<typeof formSchema>;

    const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NoteFormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reviewer: '',
            description: '',
            months: 3
        }
    })

    const onSubmit: SubmitHandler<NoteFormType> = async (formData) => {

        let dueDateTemp = entryDate;
        dueDateTemp.add(formData.months, 'months');

        const taskToSave: Task = {
            id: 0,
            caseFileId: selectedCaseFile ? selectedCaseFile.id : 0,
            workflowId: workflowId,
            workflowColor: null,
            name: '',
            description: formData.description,
            assignedToUserId: null,
            priority: 0,
            dueDate: dueDateTemp.toDate(),
            isCompleted: false,
            completedDate: null,
            reviewer: '',
            documents: [{
                id: 0,
                caseFileId: selectedCaseFile ? selectedCaseFile.id : 0,
                name: document ? document.name : '',
                path: '',
                contentType: document ? document.type : '',
                size: document ? document.size : 0
            }],
        } 

        try {            
            await tasksService.add(taskToSave);
            enqueueSnackbar("Nota creada", { variant: "success" })
            onClose(true)
        } catch (error) {
            enqueueSnackbar("Error al crear la nota", { variant: "error" })
        }
    }

    const handleToggleButtonChange = (
        event: React.MouseEvent<HTMLElement>,
        newValue: number,
    ) => {
        setWorkflowId(newValue);
    };

    const handleDocumentChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            setDocument(e.target.files[0]);
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log("Errores del formulario:", errors);
        })}>
            <DialogTitle>Datos de la Nota</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1, mb: 2, fontSize: 12, color: '#666' }}>
                    Los campos marcados con (*) son obligatorios.
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <ToggleButtonGroup
                            color="primary"
                            value={workflowId}
                            exclusive
                            onChange={handleToggleButtonChange}
                            aria-label="Workflow"
                            fullWidth
                            >
                            <ToggleButton value={1}>Ministry of Health (MOH)</ToggleButton>
                            <ToggleButton value={2}>Laboratorio Nacional de Salud (LNS)</ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>                 
                    <Grid item xs={12} sm={6}>
                         <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                            views={['year', 'month', 'day']}
                            label={'* Fecha de recepción'}
                            slotProps={{ textField: { fullWidth: true } }}
                            />
                        </LocalizationProvider>                    
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Revisor"                            
                            fullWidth
                            type='text'                                                      
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="* Descripción"                            
                            multiline
                            fullWidth
                            minRows={5}                        
                            type='text'
                            inputProps={{ maxLength: 500 }}
                            {...register('description')}
                            error={!!errors.description}
                            helperText={errors.description?.message as string | undefined}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Tiempo de atención (en meses)"                            
                            fullWidth
                            type='number'
                            {...register('months', { valueAsNumber: true })}
                            error={!!errors.months}
                            helperText={errors.months?.message as number | undefined}
                        />
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
                                onChange={handleDocumentChange}
                                multiple
                            />
                        </Button>
                        {
                            document && (
                                <div>
                                    <p style={{fontSize: '14px', paddingTop: 0, marginTop: 5}}>Documento seleccionado: {document.name}</p>
                                    {/* <p>Size: {(document.size / 1024).toFixed(2)} KB</p>
                                    <p>Type: {document.type}</p> */}
                                </div>
                            )
                        }
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
