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
import DocumentViewer from '../components/DocumentViewer'

type DialogProps = {
    documentURL: string,
    onClose: (refresh: boolean) => void    
}

// const VisuallyHiddenInput = styled('input')({
//     clip: 'rect(0 0 0 0)',
//     clipPath: 'inset(50%)',
//     height: 1,
//     overflow: 'hidden',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     whiteSpace: 'nowrap',
//     width: 1,
// });

export default function ViewDocumentDialog({documentURL, onClose}: DialogProps) {  
    
    return (
        <>
            <DialogTitle>Datos de la Nota</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1, mb: 2, fontSize: 12, color: '#666' }}>
                    
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <DocumentViewer documentURL= {documentURL}/>
                    </Grid>                 
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => { onClose(false) }}>
                    Cancelar
                </Button>                
            </DialogActions>
        </>
    )
}
