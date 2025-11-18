import { AppBar, Toolbar, Box, Typography, Avatar, IconButton, Breadcrumbs, Link } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface NavBarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const NavBar = ({ onMenuClick, sidebarOpen }: NavBarProps) => {
  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!sidebarOpen && (
            <IconButton onClick={onMenuClick}>
              <MenuIcon />
            </IconButton>
          )}
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link underline="hover" color="inherit" href="#">
              Dashboard
            </Link>
            <Typography color="text.primary">Home</Typography>
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: 'grey.400' }}>
            <AccountCircleIcon />
          </Avatar>
          <Box>
            <Typography variant="body1" fontWeight="bold">
              Muhamad Fathurahman
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sekretaris Prodi
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
