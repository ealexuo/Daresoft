import * as React from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import HomeIcon from '@mui/icons-material/Home';
import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
    textTransform: 'capitalize',
  };
}) as typeof Chip; // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591



export default function CustomizedBreadcrumbs() {

  const navigate = useNavigate();
  const location = useLocation ();

  const [items, setItems] = useState(location.pathname.substring(1).split('/'));
  
  useEffect(() => {
    setItems(i => location.pathname.substring(1).split('/'));
  }, [location.pathname]);
  
  function handleClick(index: number) {
    const path = `/${items.slice(0, index + 1).join('/')}`;
    navigate(path);
  }
  
  return (
    <div role="presentation" style={{ paddingLeft: 21, paddingTop: 21}}>      
      <Breadcrumbs aria-label="breadcrumb">
      <StyledBreadcrumb
              component="a"              
              label={'Home'}
              icon={<HomeIcon fontSize="small" />}                            
              // onClick={() => navigate('/dashboard')}
              onClick={() => navigate('/caseFiles')}
            />
        {items.map((item, index) => {
          return (
            <StyledBreadcrumb
              key={index}
              component="a"              
              label={item.replace('-', ' ')}                            
              onClick={() => handleClick(index)}             
            />
          );
        })}
      </Breadcrumbs>
      <br />
    </div>
  );
}