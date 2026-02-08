import React, { ChangeEvent, useState } from 'react'
import {
    DialogContent, DialogTitle, DialogActions, Button, Grid, TextField, Autocomplete, Box,
    ToggleButtonGroup,
    ToggleButton,
    styled,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material"
import { useForm, SubmitHandler, Controller, set } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useSnackbar } from 'notistack'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { CaseFile } from '../types/CaseFile'
import moment from 'moment'
import { useTranslation } from 'react-i18next';
import { Task } from '../types/Task'
import { tasksService } from '../services/settings/tasksService'
import { Workflow } from '../types/Workflow'
import { documentsService } from '../services/settings/documentsService'
import { Document } from '../types/Document'


type DialogProps = {
    mode: 'add' | 'edit',
    selectedCaseFile?: CaseFile,
    selectedTask?: Task,
    workflowsList: Workflow[],
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

export default function CaseFileNoteAddEditDialog({ mode, selectedCaseFile, selectedTask, workflowsList, onClose }: DialogProps) {

    const [t] = useTranslation();    
    const { enqueueSnackbar } = useSnackbar()
    const [document, setDocument] = useState<File | null>(selectedTask?.documents && selectedTask.documents.length > 0 ? new File([], selectedTask.documents[0].name) : null);
    const [selectedResponsible, setSelectedResponsible] = useState<number>(selectedTask ? (selectedTask.assignedToUserId === null ? 1 : 2) : 1);

    const formSchema = z.object({
        reviewer: z.string(),        
        description: z.string().min(1, t("errorMessages.requieredField")),
        months: z.number(),
        taskOwnerName: z.string()
    });

    const diffInMonths = (date1: Date, date2: Date) => {
        const d1 = new Date(date1);
        const d2 = new Date(date2);

        return (
            (d2.getFullYear() - d1.getFullYear()) * 12 +
            (d2.getMonth() - d1.getMonth())
        );
    }

    // Form Schema Type
    type NoteFormType = z.infer<typeof formSchema>;

    let months = 3;

    if (selectedTask) {
        months = diffInMonths(selectedTask.entryDate, selectedTask.dueDate);
        selectedTask.entryDate = new Date(selectedTask.entryDate);
    }

    const [workflowId, setWorkflowId] = useState<number>(selectedTask ? selectedTask.workflowId : 1);
    const [entryDate, setEntryDate] = useState<moment.Moment>(selectedTask ? moment(selectedTask.entryDate ) : moment());

    const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NoteFormType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reviewer: selectedTask ? selectedTask.reviewer : '',
            description: selectedTask ? selectedTask.description : '',
            months: months,
            taskOwnerName: selectedTask ? selectedTask.taskOwnerName : ''
        }
    })

    const onSubmitNewTask = async (formData: NoteFormType) => {

        let dueDateTemp = moment(entryDate);
        dueDateTemp.add(formData.months, 'months');

        const workflowTemp = workflowsList.find(w => w.id === workflowId);

        const taskToSave: Task = {
            id: 0,
            caseFileId: selectedCaseFile ? selectedCaseFile.id : 0,
            workflowId: workflowTemp ? workflowTemp.id : 0,
            workflowName: workflowTemp ? workflowTemp.name : '',
            workflowCode: workflowTemp ? workflowTemp.code : '',
            workflowColor: workflowTemp ? workflowTemp.color : null,
            name: '',
            description: formData.description,
            assignedToUserId: selectedResponsible === 1 ? null : 0, // null for local, 0 for supplier (as example)
            taskOwnerName: formData.taskOwnerName,
            priority: selectedCaseFile && selectedCaseFile.tasks ? selectedCaseFile.tasks.filter(t => t.workflowId === workflowId).length + 1 : 1,
            entryDate: entryDate.toDate(),
            dueDate: dueDateTemp.toDate(),
            isCompleted: false,
            completedDate: null,
            reviewer: formData.reviewer,
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
            const taskResponse = await tasksService.add(taskToSave);

            if(taskResponse.statusText === "OK" && document){
                
                // upload documents
                taskResponse.data.documents.forEach(async (d: Document) => {

                    let uploadUrl = await documentsService.getUploadUrl(d.id);

                    try{
                        documentsService.upload(document, uploadUrl.data);
                    }
                    catch(error){
                        console.error('Error al gargar el archivo:', error);
                    }
                });

                enqueueSnackbar("Nota creada", { variant: "success" })
            }
            
        } catch (error) {
            enqueueSnackbar("Error al crear la nota", { variant: "error" })
        } finally {
            onClose(true);
        }
        
    };

    const onSubmitEditTask = async (formData: NoteFormType) => {
        
        let dueDateTemp = moment(entryDate);
        dueDateTemp.add(formData.months, 'months');

        const documentTemp = selectedTask?.documents && selectedTask.documents.length > 0 ? selectedTask.documents[0] : null;

        const documentToSave: Document = {
            id: documentTemp ? documentTemp.id : 0,
            caseFileId: selectedTask ? selectedTask.caseFileId : 0,
            name: document ? document.name : '',
            path: '',
            contentType: document ? document.type : '',
            size: document ? document.size : 0
        }

        const taskToSave: Task = {
            id: selectedTask ? selectedTask.id : 0,
            caseFileId: selectedTask ? selectedTask.caseFileId : 0,
            workflowId: selectedTask ? selectedTask.workflowId : 0,
            workflowName: selectedTask ? selectedTask.workflowName : '',
            workflowCode: selectedTask ? selectedTask.workflowCode : '',
            workflowColor: selectedTask ? selectedTask.workflowColor : null,
            name: '',
            description: formData.description,
            assignedToUserId: selectedResponsible === 1 ? null : 0, // null for local, 0 for supplier (as example),
            taskOwnerName: formData.taskOwnerName,
            priority: selectedTask ? selectedTask.priority : 1,
            entryDate: entryDate.toDate(),
            dueDate: dueDateTemp.toDate(),
            isCompleted: false,
            completedDate: null,
            reviewer: formData.reviewer,
            documents: [],
        }
        
        // Include documents
        if(document && document.size > 0) {
            taskToSave.documents.push(documentToSave);
        }

        try {            
            const taskResponse = await tasksService.edit(taskToSave);

            if(taskResponse.statusText === "OK" && document){
                
                // upload documents
                taskResponse.data.documents.forEach(async (d: Document) => {

                    let uploadUrl = await documentsService.getUploadUrl(d.id);

                    try{
                        documentsService.upload(document, uploadUrl.data);
                    }
                    catch(error){
                        console.error('Error al gargar el archivo:', error);
                    }
                });

                enqueueSnackbar("Nota actualizada", { variant: "success" })
            }
            
        } catch (error) {
            enqueueSnackbar("Error al actualizar la nota", { variant: "error" })
        } finally {
            onClose(true);
        }
    };
        
    const onSubmit: SubmitHandler<NoteFormType> = async (formData) => {
        
        if(mode === 'add' && selectedCaseFile){
            await onSubmitNewTask(formData);
        }

        if(mode === 'edit' && selectedTask){
            await onSubmitEditTask(formData);
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
                            {
                                workflowsList.map(w => (
                                    <ToggleButton
                                        value={w.id}
                                    >
                                        {`${w.name} (${w.code})`}
                                    </ToggleButton>)
                                )
                            }                            
                        </ToggleButtonGroup>
                    </Grid>                 
                    <Grid item xs={12} sm={6}>
                         <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                            views={['year', 'month', 'day']}
                            label={'* Fecha de recepción'}
                            slotProps={{ textField: { fullWidth: true } }}
                            value={entryDate}
                            onChange={(newDate) => setEntryDate(newDate || moment())}
                            />
                        </LocalizationProvider>                    
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Revisor"                            
                            fullWidth
                            type='text'
                            {...register('reviewer')}                                                  
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
                        <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Responsable</InputLabel>
                        <Select
                            id="demo-simple-select"
                            value={selectedResponsible}
                            label="* Area responsable"
                            onChange={(e) => setSelectedResponsible(Number(e.target.value))}
                        >
                            <MenuItem value={1}>Arael (local)</MenuItem>
                            <MenuItem value={2}>Proveedor</MenuItem>                            
                        </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nombre responsable"                    
                            fullWidth
                            type='text'
                            {...register('taskOwnerName')}                                                  
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
                <Button variant="text" onClick={() => { onClose(false) }}>
                    Cancelar
                </Button>
                <Button variant="contained" type="submit" disableElevation disabled={isSubmitting}>
                    {isSubmitting ? "Guardando..." : mode === "add" ? "Agregar nota" : "Editar nota"}
                </Button>
            </DialogActions>
        </form>
    )
}
