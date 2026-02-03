import React, { useState } from 'react'
import {
    DialogContent, DialogTitle, DialogActions, Button, Grid, TextField,Dialog,
} from "@mui/material"

import { CaseFile } from '../types/CaseFile'
import CaseFileStatusEditDialog from './CaseFileStatusEdit'

type DialogProps = {
    onClose: (refresh: boolean) => void,
    selectedCaseFile: CaseFile
}

export default function SIADSearchDialog({ onClose, selectedCaseFile }: DialogProps) {

    const [openCaseFileStatusEditDialog, setOpenCaseFileStatusEditDialog] = useState<boolean>(false);  

    let MOHSIAD;
    let MOHKEY;

    let LNSSIAD;
    let LNSKEY;
    
    if(selectedCaseFile && selectedCaseFile.workflows){       
        const workflowMOH = selectedCaseFile.workflows ? selectedCaseFile.workflows.find(w => w.workflowId === 2) : undefined;
        const workflowLNS = selectedCaseFile.workflows ? selectedCaseFile.workflows.find(w => w.workflowId === 1) : undefined;

        const MOHExternalIdentifier = workflowMOH ? workflowMOH.externalIdentifier : undefined;
        const LNSExternalIdentifier = workflowLNS ? workflowLNS.externalIdentifier : undefined;

        MOHSIAD = MOHExternalIdentifier ? MOHExternalIdentifier.split('|')[0] : '';
        MOHKEY = MOHExternalIdentifier ? MOHExternalIdentifier.split('|')[1] : '';

        LNSSIAD = LNSExternalIdentifier ? LNSExternalIdentifier.split('|')[0] : '';
        LNSKEY = LNSExternalIdentifier ? LNSExternalIdentifier.split('|')[1] : '';
    }

    const handleOpenCaseFileStatusEditDialog = () => {
        setOpenCaseFileStatusEditDialog(true);
    }

    const handleCloseCaseFileStatusEditDialog = () => {
        setOpenCaseFileStatusEditDialog(false);
    }

    const handleCloseCaseFileStatusEditDialogFromAction = (refreshCaseFilesList: boolean = false) => {
        if(refreshCaseFilesList) {
            onClose(true);
        }
        setOpenCaseFileStatusEditDialog(false);
    }
    
    return (
        <>
            <DialogTitle>Consulta SIAD</DialogTitle>
            <DialogContent>                
                <Grid container spacing={2} sx={{ width: 1250 }}>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="MOH - Número de Entrada SIAD"                            
                            variant="standard"
                            fullWidth
                            value={MOHSIAD}
                            type='text'
                            inputProps={{ maxLength: 100 }} 
                            disabled={true}                           
                        />                        
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="MOH - Llave"                            
                            variant="standard"
                            value={MOHKEY}
                            fullWidth
                            type='text'
                            inputProps={{ maxLength: 100 }}  
                            disabled={true}                          
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="LNS - Número de Entrada SIAD"                            
                            variant="standard"
                            fullWidth
                            value={LNSSIAD}
                            type='text'
                            inputProps={{ maxLength: 100 }} 
                            disabled={true}                           
                        />                        
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="LNS - Llave"                            
                            variant="standard"
                            value={LNSKEY}
                            fullWidth
                            type='text'
                            inputProps={{ maxLength: 100 }}  
                            disabled={true}                          
                        />
                    </Grid>                    
                    <Grid item xs={12}>
                       <iframe
                            title="Consulta SIAD"
                            src="https://siadreg.mspas.gob.gt/consulta/"
                            width="100%"
                            height="500px"
                            style={{ border: 'none' }}
                        />
                    </Grid>                                    
                </Grid>                
            </DialogContent>
            <DialogActions style={{ justifyContent: "space-between" }}>                
                <Button variant="contained" onClick={handleOpenCaseFileStatusEditDialog}>
                    Actualizar estado del expediente
                </Button>
                <Button variant="text" onClick={() => { onClose(false) }}>
                    Cerrar
                </Button>
            </DialogActions>

            <Dialog
                open={openCaseFileStatusEditDialog}
                onClose={handleCloseCaseFileStatusEditDialog}
                maxWidth={"sm"}        
            >
            <CaseFileStatusEditDialog
                onClose={handleCloseCaseFileStatusEditDialogFromAction} 
                selectedCaseFile={selectedCaseFile}
            />
            </Dialog>
        </>
    )
}
