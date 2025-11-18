"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Divider,
  Typography,
  IconButton,
} from '@mui/material';
import { ChevronLeft } from '@mui/icons-material';
import {
  Dashboard as DashboardIcon,
  CalendarMonth,
  Person,
  Contacts,
  ManageAccounts,
  ExpandLess,
  ExpandMore,
  MenuBook,
  Note,
  Description,
  Upload,
  Mail,
  Article,
  Percent,
} from '@mui/icons-material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useState } from 'react';
import Link from 'next/link';

const drawerWidth = 280;

interface MuiSidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { title: "Dashboard", icon: DashboardIcon, url: "#" },
];

const menuLayananAkademik = [
  { title: "Kurikulum", icon: MenuBook, url: "/kurikulum" },
  { title: "Jadwal Perkuliahan", icon: CalendarMonth, url: "#" },
  { title: "Kartu Rencana Semester", icon: Note, url: "#" },
  { title: "Kartu Hasil Studi", icon: Description, url: "#" },
  { title: "Unggah Nilai Mata Kuliah", icon: Upload, url: "#" },
];

const menuCivitasAkademik = [
  { title: "Dosen", icon: Contacts, url: "/dosen" },
  { title: "Mahasiswa", icon: Person, url: "/mahasiswa" },
  { title: "Tenaga Pendidikan", icon: ManageAccounts, url: "#" },
  { title: "Alumni", icon: ManageAccounts, url: "#" },
];

const menuAdministrasi = [
  { title: "Permohonan Surat", icon: Mail, url: "#" },
  { title: "SK dan Surat Tugas Dosen", icon: Article, url: "#" },
];

const menuKeuangan = [
  { title: "Tunggakan Mahasiswa", icon: Percent, url: "#" },
];

export function MuiSidebar({ open, onClose }: MuiSidebarProps) {
  const [openAkademik, setOpenAkademik] = useState(true);
  const [openSDM, setOpenSDM] = useState(true);
  const [openAdministrasi, setOpenAdministrasi] = useState(true);
  const [openKeuangan, setOpenKeuangan] = useState(true);

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FiberManualRecordIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">OBE-Teknik Informatika</Typography>
            <Typography variant="caption" color="text.secondary">Universitas YARSI</Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose}>
          <ChevronLeft />
        </IconButton>
      </Box>
      <List>
        <ListItem disablePadding>
          <ListItemText primary="Insight" sx={{ px: 2, py: 1, color: 'text.secondary', fontSize: '0.875rem' }} />
        </ListItem>
        {menuItems.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        
        <ListItemButton onClick={() => setOpenAkademik(!openAkademik)}>
          <ListItemText primary="Layanan Akademik" />
          {openAkademik ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openAkademik} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {menuLayananAkademik.map((item) => (
              <ListItemButton key={item.title} sx={{ pl: 4 }} component={Link} href={item.url}>
                <ListItemIcon>
                  <item.icon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.875rem' }} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        <ListItemButton onClick={() => setOpenSDM(!openSDM)}>
          <ListItemText primary="Sumber Daya Manusia" />
          {openSDM ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSDM} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {menuCivitasAkademik.map((item) => (
              <ListItemButton key={item.title} sx={{ pl: 4 }} component={Link} href={item.url}>
                <ListItemIcon>
                  <item.icon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.875rem' }} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        <ListItemButton onClick={() => setOpenAdministrasi(!openAdministrasi)}>
          <ListItemText primary="Administrasi" />
          {openAdministrasi ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openAdministrasi} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {menuAdministrasi.map((item) => (
              <ListItemButton key={item.title} sx={{ pl: 4 }}>
                <ListItemIcon>
                  <item.icon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.875rem' }} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        <ListItemButton onClick={() => setOpenKeuangan(!openKeuangan)}>
          <ListItemText primary="Keuangan" />
          {openKeuangan ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openKeuangan} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {menuKeuangan.map((item) => (
              <ListItemButton key={item.title} sx={{ pl: 4 }}>
                <ListItemIcon>
                  <item.icon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.875rem' }} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
}
