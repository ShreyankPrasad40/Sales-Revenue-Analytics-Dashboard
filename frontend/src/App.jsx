import { CssBaseline, Box } from '@mui/material';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', flexDirection: 'column' }}>

      <CssBaseline />
      <Dashboard />
    </Box>
  );
}

export default App;
