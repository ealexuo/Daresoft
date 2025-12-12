import * as React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


type DialogProps = {
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',    
    title: string,
    message: string | React.ReactNode,
    loading?: boolean,
    loadingMessage?: string,
    onClose: (actionResult: boolean) => void
}

export default function AlertDialog({color, title, message, loading, loadingMessage, onClose}: DialogProps) {

    return (    
    <>
        <DialogTitle id="alert-dialog-title">
            {title}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {message}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button 
                onClick={() => onClose(false)}
                variant="text"
                color={color ? color : 'primary'}
            >
                Cancelar
            </Button>
            <Button 
                onClick={() => onClose(true)} 
                variant="contained" 
                color={color ? color : 'primary'}
                disabled={loading}
            >
                {loading ? loadingMessage ? loadingMessage : 'Cargando...' : 'Aceptar'}
            </Button>
        </DialogActions>
    </>    
    );
}
