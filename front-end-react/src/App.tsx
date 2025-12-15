import React, { useState } from 'react';
import './App.css';
import MiniDrawer from './components/MiniDrawer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Settings from './pages/settings/Settings';
import Dashboard from './pages/dashboard/Dashboard';
import NotFound from './pages/not-found/NotFound';
import SignIn from './auth/sign-in';
import SignUp from './auth/sign-up';
import Users from './pages/settings/Users';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Files from './pages/files/Files';
import Workflows from './pages/settings/Workflows'
import UserProfile from './pages/settings/UserProfile';
import Themes from './pages/settings/Themes';
import Languages from './pages/settings/Languages';
import { SnackbarProvider } from 'notistack';
import Origins from './pages/settings/Origins';
import AdministrativeUnits from './pages/settings/AdministrativeUnits';
import defaultTheme from './themes/default';
import FileDetails from './pages/files/FileDetails';
import FilesTemp from './pages/files/FilesTemp';
import Suppliers from './pages/suppliers/Suppliers';

function App() {

  const [selectedTheme, setSelectedTheme] = useState(defaultTheme);

  return (
    <ThemeProvider theme={selectedTheme}>
      <SnackbarProvider 
        maxSnack={3} 
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <CssBaseline />
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MiniDrawer />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="files" element={<Files />} />
                <Route path="filesTemp" element={<FilesTemp />} />
                <Route path="settings" element={<Settings />} />

                {/* Users Setting Section */}
                <Route path="settings/users" element={<Users />} />
                <Route path="settings/users/add-user" element={<UserProfile mode='add'/>} />
                <Route path="settings/users/edit-user" element={<UserProfile mode='edit'/>} />

                {/* Workflow Setting Section */}
                <Route path="settings/workflows" element={<Workflows />} />
                <Route path="settings/origins" element={<Origins />} />
                <Route path="settings/administrative-units" element={<AdministrativeUnits />} />

                {/* Themes Setting Section */}
                <Route path="settings/themes" element={<Themes selectedTheme = {selectedTheme} setSelectedTheme = {setSelectedTheme}/>} />
                
                {/* Languages Setting Section */}
                <Route path="settings/languages" element={<Languages />} />

                {/* Files Section */}
                <Route path="files/details/:fileId" element={<FileDetails />} />

                <Route path="*" element={<NotFound />} />
              </Route>
              <Route path="sign-in" element={<SignIn />} />
              <Route path="sign-up" element={<SignUp />} />
            </Routes>
          </BrowserRouter>
        </div>
      </SnackbarProvider>      
    </ThemeProvider>
  );
}

export default App;
