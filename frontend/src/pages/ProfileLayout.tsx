import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Tabs, Tab, Box, Container } from '@mui/material';

const tabPaths = ['', 'orders', 'addresses', 'settings'];
const tabLabels = ['Profile', 'Orders', 'Addresses', 'Settings'];

export default function ProfileLayout() {
  const location = useLocation();
  // Find the current tab index based on the path
  const currentTab = tabPaths.findIndex(path =>
    path === '' ? location.pathname === '/profile' || location.pathname === '/profile/' : location.pathname.endsWith('/' + path)
  );

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={currentTab === -1 ? 0 : currentTab}>
          {tabPaths.map((path, idx) => (
            <Tab
              key={path}
              label={tabLabels[idx]}
              component={NavLink}
              to={path === '' ? '.' : path}
            />
          ))}
        </Tabs>
      </Box>
      <Outlet />
    </Container>
  );
} 