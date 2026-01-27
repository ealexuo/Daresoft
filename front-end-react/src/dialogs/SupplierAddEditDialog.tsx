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
  FormControlLabel,
  Checkbox,
  Autocomplete
} from '@mui/material';
import { useState } from 'react';

// React Form Dependencies
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from 'react-i18next';

// Toastr Dependencies
import { useSnackbar } from 'notistack';

// Services and Types
import { Contact } from '../types/Contact';
import { contactsService } from '../services/settings/contactsService';
import { countries } from '../enums/Countries';

type DialogProps = {
  mode: 'add' | 'edit',
  selectedSupplier: Contact,
  onClose: (refreshSuppliersList: boolean) => void
}

export default function SupplierAddEditDialog({ mode, selectedSupplier, onClose }: DialogProps) {
  
  const [loading, setLoading] = useState<boolean>(false);
  const [t] = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedCountry, setSelectedCountry] = useState<{ label: string; value: string }>({ label: countries[68].name, value: countries[68].code }); 

  // Form Schema definition
  const formSchema = z.object({      
      id: z.number().int(),
      salutation: z.string(),      
      name: z.string().min(1, t("errorMessages.requieredField")),
      middleName: z.string(),
      lastName: z.string().min(1, t("errorMessages.requieredField")),
      otherName: z.string(),
      title: z.string(),
      homeAddressLine1: z.string(),
      homeAddressLine2: z.string(),
      homeCity: z.string(),
      homeState: z.string(),
      homePostalCode: z.string(),
      countryId: z.number().int(),
      workAddressLine1: z.string(),
      workAddressLine2: z.string(),
      workCity: z.string(),
      workState: z.string(),
      workPostalCode: z.string(),
      workCountry: z.string(),
      workEmail: z.string().email(t("errorMessages.invalidEmail")).min(1, t("errorMessages.requieredField")),
      homeEmail: z.string(),
      homePhone: z.string(),
      workPhone: z.string(),
      workPhoneExt: z.string(),
      mobilePhone: z.string(),
      companyId: z.number().int(),
      companyName: z.string().min(1, t("errorMessages.requieredField")),
      contactTypeId: z.number().int(),
      notes: z.string(),
      preferredAddress: z.number().int(),
      website: z.string(),
      isSupplier: z.boolean()
  });

  // Form Schema Type
  type SupplierFormType = z.infer<typeof formSchema>;

  // Form Hook
  const { register, handleSubmit, formState: {errors, isSubmitting} } = useForm<SupplierFormType>({
      defaultValues: selectedSupplier,
      resolver: zodResolver(formSchema),
  });
    
  const onSubmit: SubmitHandler<SupplierFormType> = async (formData) => {

    let supplierToSave: Contact = { ...formData };
    supplierToSave.countryId = countries.find(c => c.code === selectedCountry.value)?.id ?? 69; // default Guatemala

    try {
      setLoading(true);

      try {        
        if (mode === 'add') {
          await contactsService.add(supplierToSave); 
          enqueueSnackbar('Proveedor creado.', { variant: 'success' });
        } else {

          await contactsService.edit(supplierToSave); 
          enqueueSnackbar('Proveedor actualizado.', { variant: 'success' });
        }
      } catch (error) {
        throw error;
      }

      onClose(true);
    } catch (error) {
      enqueueSnackbar('Error al guardar proveedor.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (mode === 'edit' && selectedSupplier) {
      const country = countries.find(c => c.id === selectedSupplier.countryId);   
      if (country) {
        setSelectedCountry({ label: country.name, value: country.code });
      }
    }
  }, [mode, selectedSupplier]);

  return (
    
    <Box sx={{ my: 3 }}
      component="form"
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log("Form errors: ", errors);
      })}
    >
      <DialogTitle>
        {mode === 'add' ? "Nuevo Proveedor" : "Editar Proveedor"}        
      </DialogTitle>
      <DialogContent>

        <Box sx={{ my: 3 }}>
         
          <Typography variant="subtitle1">
            Información general
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

              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('companyName')}
                  label="* Empresa/Compañía"
                  fullWidth
                  size="small"
                  error={!!errors.companyName}
                  helperText={errors.companyName?.message as string | undefined}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  disableClearable
                  options={countries.map((country) => ({ label: country.name, value: country.code }))}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option: any, value: any) => option.value === value.value}
                  value={selectedCountry}
                  onChange={(event, newValue) => {
                      setSelectedCountry(newValue ? newValue : { label: countries[68].name, value: countries[68].code });
                  }}
                  renderOption={(props, option) => (
                      <li {...props} key={option.value}>                                                        
                          {option.label}
                      </li>
                  )}
                  renderInput={(params) => (
                      <TextField
                              {...params}
                              label="País"
                              fullWidth
                              size="small"
                          />   
                  )}
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