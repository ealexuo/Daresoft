import * as React from 'react';

// General Dependencies
import { 
  DialogContent,
  DialogTitle,
  Box,
  DialogActions,
  Button,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useState } from 'react';

// Toastr Dependencies
import { useSnackbar } from 'notistack';

// Services and Types
import { CaseFile } from '../types/CaseFile';
import { caseFilesService } from '../services/settings/caseFilesService';

type DialogProps = {  
  selectedCaseFile: CaseFile,
  onClose: (refreshSuppliersList: boolean) => void
}

const caseFileStatusOptions = [
  { label: 'Sin estado', value: 0},
  { label: 'Ingresado', value: 1},
  { label: 'En proceso', value: 2 },
  { label: 'Reingresado', value: 3 },
  { label: 'Aceptado', value: 4 },
  { label: 'Rechazado', value: 5 }
];

export default function CaseFileStatusEditDialog({ selectedCaseFile, onClose }: DialogProps) {
  
  const { enqueueSnackbar } = useSnackbar();  
  const [selectedStatus, setSelectedStatus] = useState<number>(selectedCaseFile.workflows && selectedCaseFile.workflows.length > 0 ? selectedCaseFile.workflows[0].workflowStatusId : 0);
  const [loading, setLoading] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  const initialStatus = selectedCaseFile.workflows && selectedCaseFile.workflows.length > 0 ? selectedCaseFile.workflows[0].workflowStatusId : 0;

  const onSubmit = async () => {

    const workflowsToSave = selectedCaseFile.workflows ? [...selectedCaseFile.workflows] : [];

    workflowsToSave.forEach(w => {
      w.workflowStatusId = selectedStatus;
      w.notes = notes;
      
    });

    setLoading(true);
    try {
      const response = await caseFilesService.editWorkflows(workflowsToSave);

      if(response && response.status !== 200) {
        throw new Error('Error al actualizar el estado del expediente.');        
      }

      enqueueSnackbar('Estado del expediente actualizado.', { variant: 'success' });      
    } catch (error) {
      enqueueSnackbar('Error al actualizar el estado del expediente.', { variant: 'error' });
    } 
    finally {
      setLoading(false);
      onClose(true);
    }

  };

  return (
    
    <Box sx={{ my: 0 }}  >
      <DialogTitle>{'Actualizar estado del expediente'}</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 0 }}>
          <Paper
            variant="outlined"
            sx={{ my: { xs: 2, md: 2 }, p: { xs: 2, md: 3 } }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedStatus}
                    label="Estado"
                    onChange={(event) => setSelectedStatus(event.target.value as number)}
                  >
                    {caseFileStatusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Observaciones"
                  fullWidth
                  size="small"
                  multiline
                  minRows={4}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>          
        </Box>
      </DialogContent>
      <DialogActions>
          <Button variant="text" onClick={() => {onClose(false)}}>
              Cancelar
          </Button>
          <Button 
              variant="contained" 
              onClick={onSubmit}
              disableElevation 
              disabled = {loading || selectedStatus === initialStatus}>
              {loading ? "Actualizando..." : "Actualizar"}
          </Button>
      </DialogActions>      
    </Box>
    
  );
}