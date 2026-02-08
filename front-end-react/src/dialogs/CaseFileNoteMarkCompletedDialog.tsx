import React, { ChangeEvent, useState } from 'react'
import {
    DialogContent, DialogTitle, DialogActions, Button, Grid, styled,
    Box,
} from "@mui/material"
import { useSnackbar } from 'notistack'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { CaseFile } from '../types/CaseFile'
import moment from 'moment'
import { useTranslation } from 'react-i18next';
import { Task } from '../types/Task'
import { on } from 'events'
import { tasksService } from '../services/settings/tasksService'
import { Document } from '../types/Document'
import { documentsService } from '../services/settings/documentsService'

type DialogProps = {
    selectedCaseFile?: CaseFile,
    selectedTask: Task,
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

export default function CaseFileNoteMarkCompletedDialog({ selectedCaseFile, selectedTask, onClose }: DialogProps) {

    console.log('Selected task:', selectedTask);

    const [loading, setLoading] = useState<boolean>(false);
    const [t] = useTranslation();    
    const { enqueueSnackbar } = useSnackbar()

    const [completedDate, setCompletedDate] = useState<moment.Moment>(selectedTask?.completedDate ? moment(selectedTask.completedDate) : moment());
    const [document, setDocument] = useState<File | null>(
        selectedTask?.documents && 
        selectedTask.documents.length > 0 && 
        selectedTask.documents.find(d => d.path.includes(`tasks/${selectedTask.id}/completion-document/`)) ? 
        new File([], selectedTask.documents.find(d => d.path.includes(`tasks/${selectedTask.id}/completion-document`))?.name || '') : null
    );
 
    const handleDocumentChange = (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            setDocument(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {

        const documentTemp = selectedTask.documents.find(d => d.path.includes(`tasks/${selectedTask.id}/completion-document/`)) || null;

        const documentToSave: Document = {
            id: documentTemp ? documentTemp.id : 0,
            caseFileId: selectedTask ? selectedTask.caseFileId : 0,
            name: document ? document.name : '',
            path: document ? `/case-files/${selectedTask.caseFileId}/workflows/${selectedTask.workflowId}/tasks/${selectedTask.id}/completion-document/${document.name}` : '',
            contentType: document ? document.type : '',
            size: document ? document.size : 0
        };

        selectedTask.isCompleted = true;
        selectedTask.completedDate = completedDate.toDate();
        selectedTask.documents = [];

        // Include documents
        if(document && document.size > 0) {
            selectedTask.documents.push(documentToSave);
        }
        
        setLoading(true);   
        try {

            if(selectedTask) {
                                
                const response = await tasksService.edit(selectedTask); 

                if (response.statusText === "OK") {

                    if(document){
                        // upload documents
                        response.data.documents.forEach(async (d: Document) => {
        
                            let uploadUrl = await documentsService.getUploadUrl(d.id);
        
                            try{
                                documentsService.upload(document, uploadUrl.data);
                            }
                            catch(error){
                                console.error('Error al gargar el archivo:', error);
                            }
                        });                        
                    }                   

                    setLoading(false);
                    enqueueSnackbar('Tarea finalizada.', { variant: "success" });
                    onClose(true);
                } else {
                    enqueueSnackbar('Ocurrió un error al finalizar la tarea.', { variant: "error" });
                }
            }

        } catch (error: any) {
            enqueueSnackbar('Ocurrió un error al finalizar la tarea. Detalles: ' + error.message, { variant: "error" });
            onClose(false);
        }             
    };   

    return (        
        <>
            <DialogTitle>Marcar nota como finalizada</DialogTitle>            
            <DialogContent>
                <Box sx={{ mt: 1, mb: 3, fontSize: 12, color: '#666' }}>
                    Los campos marcados con (*) son obligatorios.
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                views={['year', 'month', 'day']}
                                label={'* Fecha de finalización'}
                                slotProps={{ textField: { fullWidth: true } }}
                                value={completedDate}
                                onChange={(newDate) => setCompletedDate(newDate || moment())}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button
                            component="label"
                            role={undefined}
                            variant="outlined"
                            tabIndex={-1}
                            startIcon={<UploadFileIcon />}                                
                            >
                            Agregar comprobante de finalización
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
                <Button variant="contained" onClick={handleSubmit} disableElevation disabled={loading}>
                    {loading ? "Guardando..." : "Aceptar"}
                </Button>
            </DialogActions>
        </>
    )
}
