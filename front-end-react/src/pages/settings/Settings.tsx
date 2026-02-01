import * as React from 'react';
import Grid from '@mui/material/Grid';
import ActionsCard from '../../components/ActionsCard';
import GroupIcon from '@mui/icons-material/Group';
import Page from '../../components/Page';
import BrushIcon from '@mui/icons-material/Brush';
import AccountTreeIcon from '@mui/icons-material/AccountTree'

export default function Settings() {

  const [showUserManagement, setShowUserManagement] = React.useState<boolean>(true);
  const [showWorkflowManagement, setShowWorkflowManagement] = React.useState<boolean>(false);
  const [showAppearanceManagement, setShowAppearanceManagement] = React.useState<boolean>(false);

  const usersActions = [
    {
      name: 'Gestión de Usuarios',
      link: '/settings/users',
    },
    {
      name: 'Gestión de Roles',
      link: '/settings/roles',
      disabled: true
    }
  ];

  const workflowActions = [
    {
      name: 'Procesos',
      link: '/settings/workflows',
      disabled: true      
    },
    // {
    //   name: 'Orígenes',
    //   link: '/settings/origins'      
    // },
    // {
    //   name: 'Unidades Administrativas',
    //   link: '/settings/administrative-units',      
    // }
  ];

  const appearanceActions = [
    {
      name: 'Temas',
      link: '/settings/themes',
    },
    {
      name: 'Idioma',
      link: '/settings/languages'
    }
  ];

  return (
    <Page title='Configuración'>
      <Grid container spacing={2} className="center">
        {showUserManagement && (
          <Grid item>
            <ActionsCard
              heading="Usuarios"
              actions={usersActions}
              icon={<GroupIcon/>}
            ></ActionsCard>
          </Grid>
        )}
        {showWorkflowManagement && (
          <Grid item>
            <ActionsCard
              heading="Procesos"
              actions={workflowActions}
              icon={<AccountTreeIcon/>}
            ></ActionsCard>
          </Grid> 
        )}
        {showAppearanceManagement && (
          <Grid item>
            <ActionsCard
              heading="Apariencia"
              actions={appearanceActions}
              icon={<BrushIcon/>}
            ></ActionsCard>
          </Grid>        
        )}
      </Grid>
    </Page>
  );
}