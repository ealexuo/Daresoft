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

type DialogProps = {
  mode: 'add' | 'edit',
  type: 'user' | 'supplier' | 'contact',
  selectedItem: any,
  contact: Contact | undefined,
  onClose: (refreshUsersList: boolean) => void
}

export default function UserAddEditDialog({ mode, type, selectedItem, contact, onClose }: DialogProps) {
  
  const [loading, setLoading] = useState<boolean>(false);
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  // Empty contact object
  const emptyContactObject: Contact = {
    id: 0,
    salutation: '',
    name: '',
    middleName: '',
    lastName: '',
    otherName: '',
    title: '',
    homeAddressLine1: '',
    homeAddressLine2: '',
    homeCity: '',
    homeState: '',
    homePostalCode: '',
    countryId: 0,
    workAddressLine1: '',
    workAddressLine2: '',
    workCity: '',
    workState: '',
    workPostalCode: '',
    workCountry: '',
    workEmail: '',
    homeEmail: '',
    homePhone: '',
    workPhone: '',    
    workPhoneExt: '',
    mobilePhone: '',
    companyId: 0,
    contactTypeId: 0,
    notes: '',
    preferredAddress: 0,
    companyName: '',
    website: '',
    //primaryContactId: 0,
    isSupplier: false,
    isDeleted: false,
  };

  // Form Schema definition
  const formSchema = z.object({

      // User fields
      userId: z.number().int().optional(),
      userName: z.string().min(1, t("errorMessages.requieredField")),
      isActive: z.boolean(),

      // Contact fields
      id: z.number().int(), // contact id
      salutation: z.string().optional(),
      name: z.string().optional(),
      middleName: z.string().optional(),
      lastName: z.string().optional(),
      otherName: z.string().optional(),
      title: z.string().optional(),

      homeAddressLine1: z.string().optional(),
      homeAddressLine2: z.string().optional(),
      homeCity: z.string().optional(),
      homeState: z.string().optional(),
      homePostalCode: z.string().optional(),

      countryId: z.number().int().optional(), // int?, optional nullable

      workAddressLine1: z.string().optional(),
      workAddressLine2: z.string().optional(),
      workCity: z.string().optional(),
      workState: z.string().optional(),
      workPostalCode: z.string().optional(),
      workCountry: z.string().optional(),

      workEmail: z.string().optional(),
      homeEmail: z.string().optional(),

      homePhone: z.string().optional(),
      workPhone: z.string().optional(),
      workPhoneExt: z.string().optional(),
      mobilePhone: z.string().optional(),

      companyId: z.number().int().optional(), // int?, optional nullable
      contactTypeId: z.number().int().optional(), // required int

      notes: z.string().optional(),
      preferredAddress: z.number().int().optional(), // int?, optional nullable
      companyName: z.string().optional(),
      website: z.string().optional(),
      //primaryContactId: z.number().int().optional(), // int?, optional nullable

      isSupplier: z.boolean(),
      isDeleted: z.boolean(),
  });

  // Form Schema Type
  type ContactFormType = z.infer<typeof formSchema>;


  // Form Hook
  const { register, handleSubmit, formState: {errors, isSubmitting} } = useForm<ContactFormType>({
      defaultValues: {
        userId: selectedItem?.id || 0,
        userName: selectedItem?.userName || '',
        isActive: selectedItem?.isActive || true,        
        ...contact
      },     
      resolver: zodResolver(formSchema),
  });
    
    
  const onSubmit: SubmitHandler<ContactFormType> = async (formData) => {
    try {
      setLoading(true);

      console.log("Form Data to submit: ", formData);

      // const userToSave = {
      //   ...data,
      //   id: selectedUser?.id || 0,
      //   contactId: selectedUser?.contactId || 0
      // };

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

          { 
            type === 'user' ? (
              <div>
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
                        defaultValue={selectedItem?.userName || ''}
                        error={!!errors.userName}
                        helperText={errors.userName?.message as string | undefined}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Checkbox {...register('isActive')} defaultChecked={selectedItem?.isActive} />}
                        label="Activo"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </div>
            ) : (<></>)
          }           
          
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
                  {...register('salutation')}
                  label="Salutation"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('name')}
                  label="Nombre"
                  fullWidth
                  size="small"
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
                  label="Apellido"
                  fullWidth
                  size="small"
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
                  {...register('title')}
                  label="Título"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('homeAddressLine1')}
                  label="Dirección Personal Línea 1"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('homeAddressLine2')}
                  label="Dirección Personal Línea 2"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('homePostalCode')}
                  label="Código Postal Personal"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('countryId')}
                  label="País"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('workAddressLine1')}
                  label="Dirección Laboral Línea 1"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('workAddressLine2')}
                  label="Dirección Laboral Línea 2"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('workCity')}
                  label="Ciudad Laboral"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('workPostalCode')}
                  label="Código Postal Laboral"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('workCountry')}
                  label="País Laboral"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('workEmail')}
                  label="Correo Laboral"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('homeEmail')}
                  label="Correo Personal"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('homePhone')}
                  label="Teléfono Personal"
                  fullWidth
                  size="small"
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
                  {...register('companyId')}
                  label="Id Empresa"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('contactTypeId')}
                  label="Título"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('notes')}
                  label="Notas"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('preferredAddress')}
                  label="Dirección Preferida"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('companyName')}
                  label="Empresa"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('title')}
                  label="Título"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('website')}
                  label="Sitio Web"
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('title')}
                  label="Título"
                  fullWidth
                  size="small"
                />
              </Grid>             

              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox {...register('isSupplier')} defaultChecked={contact?.isSupplier} />}
                  label="Es Proveedor"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('isDeleted')}
                  label="¿Eliminado?"
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