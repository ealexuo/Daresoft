import {
    DialogContent, DialogActions, Button, Grid, Box, DialogTitle
} from "@mui/material"
import DocumentViewer from '../components/DocumentViewer'

type DialogProps = {
    title?: string,
    documentURL: string,
    onClose: (refresh: boolean) => void    
}

export default function ViewDocumentDialog({title, documentURL, onClose}: DialogProps) {  
    
    return (
        <Box sx={{ width: '800px', maxWidth: '100%' }}>
            <DialogTitle>                
                {title ? title : "Documento"}
            </DialogTitle>
            <DialogContent>                
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                        <DocumentViewer documentURL= {documentURL}/>
                    </Grid>                 
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="text" onClick={() => { onClose(false) }}>
                    Cerrar
                </Button>                
            </DialogActions>
        </Box>
    )
}
