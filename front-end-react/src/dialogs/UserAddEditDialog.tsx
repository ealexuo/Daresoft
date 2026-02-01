import * as React from 'react';

// General Dependencies
import { 
  DialogContent,
  DialogTitle,
  Box,
  DialogActions,
  Button,
  Typography,
  Paper,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox
} from '@mui/material';

// React Form Dependencies
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from 'react-i18next';

// Toastr Dependencies
import { useSnackbar } from 'notistack';

// Services and Types
import { User } from '../types/User';
import { usersService } from '../services/settings/usersService';

type DialogProps = {
  mode: 'add' | 'edit',
  selectedUser: User,
  onClose: (refreshUsersList: boolean) => void
}

export default function UserAddEditDialog({ mode, selectedUser, onClose }: DialogProps) {
  
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  // Hack to populate the passowrd property when edit a existing user
  if(mode === 'edit') {
    selectedUser.password = 'password'; 
    selectedUser.passwordConfirm = 'password';
  }

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
      isAdmin: z.boolean(),
      isPasswordChangeRequired: z.boolean(),
      password: z.string().min(1, t("errorMessages.requieredField")),
      passwordConfirm: z.string().min(1, t("errorMessages.requieredField"))
  }).superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Los passwords no coinciden",
        path: ["passwordConfirm"],
      });
    }
  });

  // Form Schema Type
  type UserFormType = z.infer<typeof formSchema>;

  // Form Hook
  const { register, handleSubmit, formState: {errors, isSubmitting} } = useForm<UserFormType>({
      defaultValues: { ...selectedUser, isAdmin: selectedUser?.roleId === 1 },
      resolver: zodResolver(formSchema),
  });
    
  const onSubmit: SubmitHandler<UserFormType> = async (formData) => {

    const roleId = formData.isAdmin ? 1 : 2;

    const userToSave: User = { 
      ...formData,
      isActive: true,
      roleId: roleId
    };

    try {
      try {        
        if (mode === 'add') {
          await usersService.add(userToSave); 
          enqueueSnackbar('Usuario creado.', { variant: 'success' });
        } else {
          userToSave.password = '';
          userToSave.passwordConfirm = '';
          await usersService.edit(userToSave); 
          enqueueSnackbar('Usuario actualizado.', { variant: 'success' });
        }
      } catch (error) {
        throw error;
      }

      onClose(true);
    } catch (error) {
      enqueueSnackbar('Error al guardar usuario.', { variant: 'error' });
    } 
  };

  return (
    
    <Box sx={{ my: 0 }}
      component="form"
      onSubmit={handleSubmit(onSubmit, error => console.log('Form error', error))}
    >
      <DialogTitle>{mode === 'add' ? "Nuevo usuario" : "Editar usuario"}</DialogTitle>      
      <DialogContent>
        <Box sx={{ my: 0 }}>          
          <Box sx={{ mt: 0, mb: 1, fontSize: 12, color: '#666' }}>
            Los campos marcados con (*) son obligatorios.
          </Box>
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
                  label="* Nombre de usuario"
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
                  control={<Checkbox {...register('isAdmin')} defaultChecked={selectedUser?.roleId === 1} />}
                  label="Administrador"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('password')}
                  type='password'
                  label="* Password"
                  fullWidth
                  size="small"
                  defaultValue={selectedUser?.password || ''}
                  error={!!errors.password}
                  helperText={errors.password?.message as string | undefined}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('passwordConfirm')}
                  type='password'
                  label="* Confirmar Password"
                  fullWidth
                  size="small"
                  defaultValue={selectedUser?.passwordConfirm || ''}
                  error={!!errors.passwordConfirm}
                  helperText={errors.passwordConfirm?.message as string | undefined}
                />
              </Grid>
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
                  label="* Correo electrónico"
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