import * as React from 'react';

// General Dependencies
import { 
  DialogContent,
  DialogTitle,
  DialogContentText,
  Box,
  DialogActions,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Autocomplete, 
  FormLabel, 
  MenuItem, 
  Select
} from '@mui/material';
import { useState, useEffect } from 'react';

// React Form Dependencies
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from 'react-i18next';

// Toastr Dependencies
import { useSnackbar } from 'notistack';

// Services and Types
import { contactsService } from '../services/settings/contactsService';
import { Contact } from '../types/Contact';
import { User } from '../types/User';
import { ColorPicker } from 'primereact/colorpicker';
import { usersService } from '../services/settings/usersService';

type DialogProps = {
  mode: 'add' | 'edit',
  selectedUser: User,
  onClose: (refreshUsersList: boolean) => void
}

export default function UserAddEditDialog({ mode, selectedUser, onClose }: DialogProps) {
  
  const [loading, setLoading] = useState<boolean>(false);
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  // Form Schema definition
  const formSchema = z.object({      
      id: z.number().int(),      
      userName: z.string().min(1, t("errorMessages.requieredField")),
      contactId: z.number().int(),
      name: z.string().min(1, t("errorMessages.requieredField")),
      middleName: z.string(),
      lastName: z.string().min(1, t("errorMessages.requieredField")),
      otherName: z.string(),
      workEmail: z.string().email(t("errorMessages.invalidEmail")).min(1, t("errorMessages.requieredField")),
      workPhone: z.string(),      
      workPhoneExt: z.string(),
      mobilePhone: z.string(),
      color: z.string(),
      profilePicture: z.string().nullable(),
      profilePictureContentType: z.string().nullable(),
      isDeleted: z.boolean(),
      isActive: z.boolean(),
      isPasswordChangeRequired: z.boolean()     
  });

  // Form Schema Type
  type UserFormType = z.infer<typeof formSchema>;

  // Form Hook
  const { register, handleSubmit, watch, formState: {errors, isSubmitting} } = useForm<UserFormType>({
      defaultValues: selectedUser,
      resolver: zodResolver(formSchema),
  });
    
  // Watch the color schema property to be shown in the textfield
  //const selectedColor = watch('color', selectedUser?.color);
    
  const onSubmit: SubmitHandler<UserFormType> = async (formData) => {

    const userToSave: User = { ...formData };

    try {
      setLoading(true);

      try {        
        if (mode === 'add') {
          // await contactsService.createUser(formData); 
          // enqueueSnackbar('Usuario creado exitosamente.', { variant: 'success' });
        } else {
          await usersService.edit(userToSave); 
          enqueueSnackbar('Usuario actualizado exitosamente.', { variant: 'success' });
        }
      } catch (error) {
        throw error;
      }

      onClose(true);
    } catch (error) {
      enqueueSnackbar('Error al guardar usuario.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <Box sx={{ my: 3 }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <DialogTitle>{"User Profile"}</DialogTitle>
      <DialogContent>
        <DialogContentText>Add or Edit User Profile</DialogContentText>

        <Box sx={{ my: 3 }}>
          <Typography variant="subtitle1">
            Información de usuario
          </Typography>
          <Paper
            variant="outlined"
            sx={{ my: { xs: 2, md: 2 }, p: { xs: 2, md: 3 } }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('userName')}
                  label="Nombre de usuario"
                  fullWidth
                  size="small"
                  disabled={mode === 'edit'}
                  defaultValue={selectedUser?.userName || ''}
                  error={!!errors.userName}
                  helperText={errors.userName?.message as string | undefined}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={<Checkbox {...register('isActive')} defaultChecked={selectedUser?.isActive} />}
                  label="Activo"
                />
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <TextField
                  {...register('profilePicture')}
                  label="Foto de Perfil"
                  fullWidth
                  size="small"
                />
              </Grid>    */}             
              {/* <Grid item xs={12} sm={6}>
                  <TextField
                      required
                      label="Color"
                      fullWidth
                      variant="standard"                                        
                      value={selectedColor?.startsWith('#') ? selectedColor : '#' + selectedColor}
                      InputProps={{
                          readOnly: true,                                        
                      }}                                        
                  />

                  <ColorPicker
                      inputId="cp-hex"
                      format="hex"
                      defaultValue={selectedUser?.color}
                      className="mb-3"
                      inputStyle={{ position: 'absolute', width: '20px' }}
                      appendTo="self"
                      {...register("color")}
                  />
              </Grid> */}              
            </Grid>
          </Paper>
          
          <Typography variant="subtitle1">
            Información de contacto
          </Typography>

          <Paper
            variant="outlined"
            sx={{ my: { xs: 2, md: 2 }, p: { xs: 2, md: 3 } }}
          >
            <Grid container spacing={3}>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('name')}
                  label="* Nombre"
                  fullWidth
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name?.message as string | undefined}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('middleName')}
                  label="Segundo Nombre"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('lastName')}
                  label="* Apellido"
                  fullWidth
                  size="small"
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message as string | undefined}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('otherName')}
                  label="Segundo Apellido"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('mobilePhone')}
                  label="Teléfono Móvil"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('workEmail')}
                  label="* Correo Laboral"
                  fullWidth
                  size="small"
                  error={!!errors.workEmail}
                  helperText={errors.workEmail?.message as string | undefined}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('workPhone')}
                  label="Teléfono Laboral"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('workPhoneExt')}
                  label="Extensión Teléfono Laboral"
                  fullWidth
                  size="small"
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
          <Button variant="contained" type="submit" disableElevation disabled = {isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
          </Button>
      </DialogActions>      
    </Box>
  );
}