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
import UserProfile from './pages/settings/UserProfile';
import Themes from './pages/settings/Themes';
import Languages from './pages/settings/Languages';
import { SnackbarProvider } from 'notistack';
import defaultTheme from './themes/default';
import CaseFiles from './pages/caseFiles/CaseFiles';
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
                {/* <Route index element={<Dashboard />} /> */}
                <Route index element={<CaseFiles />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="suppliers" element={<Suppliers />} />
                <Route path="caseFiles" element={<CaseFiles />} />
                <Route path="settings" element={<Settings />} />

                {/* Users Setting Section */}
                <Route path="settings/users" element={<Users />} />
                <Route path="settings/users/add-user" element={<UserProfile mode='add'/>} />
                <Route path="settings/users/edit-user" element={<UserProfile mode='edit'/>} />
                
                {/* Themes Setting Section */}
                <Route path="settings/themes" element={<Themes selectedTheme = {selectedTheme} setSelectedTheme = {setSelectedTheme}/>} />
                
                {/* Languages Setting Section */}
                <Route path="settings/languages" element={<Languages />} />

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
