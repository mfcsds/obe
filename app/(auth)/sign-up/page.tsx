import RegistrationForm from "@/components/form/register/RegistrationForm";
import { Box, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const SignUpPage = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', md: '66.67%' }, alignItems: 'center', justifyContent: 'center', p: { xs: 2, md: 0 }, border: 1, borderColor: 'divider' }}>
        <FiberManualRecordIcon sx={{ fontSize: 200, color: 'primary.main' }} />
        <Typography variant="h6" color="text.secondary" fontStyle="italic">
          AI Based Curriculum Design
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', width: { xs: '100%', md: '33.33%' }, alignItems: 'center', justifyContent: 'center', bgcolor: { xs: 'background.paper', md: 'grey.100' }, p: { xs: 2, md: 0 } }}>
        <RegistrationForm />
      </Box>
    </Box>
  );
};

export default SignUpPage;
