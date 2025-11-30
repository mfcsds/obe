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
  School,
  EmojiEvents,
  PauseCircle,
  Info,
  Grade,
  AssignmentTurnedIn,
} from '@mui/icons-material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const drawerWidth = 280;

interface MuiSidebarProps {
  open: boolean;
  onClose: () => void;
}

interface MenuItem {
  title: string;
  icon: React.ElementType;
  url: string;
  roles?: string[];
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", icon: DashboardIcon, url: "#", roles: ['kaprodi', 'dosen', 'mahasiswa'] },
];

const menuLayananAkademik: MenuItem[] = [
  // General
  { title: "Kurikulum", icon: MenuBook, url: "/kurikulum", roles: ['kaprodi', 'dosen', 'mahasiswa'] },
  { title: "Jadwal Perkuliahan", icon: CalendarMonth, url: "#", roles: ['kaprodi', 'dosen', 'mahasiswa'] },
  { title: "Informasi Beasiswa", icon: EmojiEvents, url: "#", roles: ['kaprodi', 'mahasiswa'] },
  { title: "Panduan Akademik", icon: Info, url: "#", roles: ['kaprodi', 'mahasiswa'] },

  // Specific
  { title: "Kartu Rencana Semester", icon: Note, url: "#", roles: ['kaprodi', 'mahasiswa'] },
  { title: "Kartu Hasil Studi", icon: Description, url: "#", roles: ['kaprodi', 'mahasiswa'] },
  { title: "Transkrip Nilai", icon: Grade, url: "#", roles: ['kaprodi', 'mahasiswa'] },
  { title: "Pendaftaran Wisuda", icon: School, url: "#", roles: ['kaprodi', 'mahasiswa'] },
  { title: "Cuti Akademik", icon: PauseCircle, url: "#", roles: ['kaprodi', 'mahasiswa'] },
  { title: "Surat Keterangan Aktif", icon: AssignmentTurnedIn, url: "#", roles: ['kaprodi', 'mahasiswa'] },

  // Dosen specific
  { title: "Unggah Nilai Mata Kuliah", icon: Upload, url: "#", roles: ['kaprodi', 'dosen'] },
];

const menuCivitasAkademik: MenuItem[] = [
  { title: "Dosen", icon: Contacts, url: "/dosen", roles: ['kaprodi', 'dosen', 'mahasiswa'] },
  { title: "Mahasiswa", icon: Person, url: "/mahasiswa", roles: ['kaprodi', 'dosen'] },
  { title: "Tenaga Pendidikan", icon: ManageAccounts, url: "#", roles: ['kaprodi'] },
  { title: "Alumni", icon: ManageAccounts, url: "/alumni", roles: ['kaprodi'] },
];

const menuAdministrasi: MenuItem[] = [
  { title: "Permohonan Surat", icon: Mail, url: "#", roles: ['mahasiswa'] },
  { title: "SK dan Surat Tugas Dosen", icon: Article, url: "#", roles: ['dosen', 'kaprodi'] },
];

const menuKeuangan: MenuItem[] = [
  { title: "Tunggakan Mahasiswa", icon: Percent, url: "#", roles: ['kaprodi'] },
];

export function MuiSidebar({ open, onClose }: MuiSidebarProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const [openAkademik, setOpenAkademik] = useState(true);
  const [openSDM, setOpenSDM] = useState(true);
  const [openAdministrasi, setOpenAdministrasi] = useState(true);
  const [openKeuangan, setOpenKeuangan] = useState(true);

  // Helper to filter items based on role
  const filterItems = (items: MenuItem[]) => {
    if (!userRole) return [];
    return items.filter(item => item.roles?.includes(userRole));
  };

  const filteredItems = filterItems(menuItems);
  const filteredLayananAkademik = filterItems(menuLayananAkademik);
  const filteredCivitasAkademik = filterItems(menuCivitasAkademik);
  const filteredAdministrasi = filterItems(menuAdministrasi);
  const filteredKeuangan = filterItems(menuKeuangan);

  if (!session) return null;

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
        {filteredItems.map((item) => (
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

        {filteredLayananAkademik.length > 0 && (
          <>
            <ListItemButton onClick={() => setOpenAkademik(!openAkademik)}>
              <ListItemText primary="Layanan Akademik Mahasiswa" />
              {openAkademik ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openAkademik} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {filteredLayananAkademik.map((item) => (
                  <ListItemButton key={item.title} sx={{ pl: 4 }} component={Link} href={item.url}>
                    <ListItemIcon>
                      <item.icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </>
        )}

        {filteredCivitasAkademik.length > 0 && (
          <>
            <ListItemButton onClick={() => setOpenSDM(!openSDM)}>
              <ListItemText primary="Sumber Daya Manusia" />
              {openSDM ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openSDM} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {filteredCivitasAkademik.map((item) => (
                  <ListItemButton key={item.title} sx={{ pl: 4 }} component={Link} href={item.url}>
                    <ListItemIcon>
                      <item.icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </>
        )}

        {filteredAdministrasi.length > 0 && (
          <>
            <ListItemButton onClick={() => setOpenAdministrasi(!openAdministrasi)}>
              <ListItemText primary="Administrasi" />
              {openAdministrasi ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openAdministrasi} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {filteredAdministrasi.map((item) => (
                  <ListItemButton key={item.title} sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <item.icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </>
        )}

        {filteredKeuangan.length > 0 && (
          <>
            <ListItemButton onClick={() => setOpenKeuangan(!openKeuangan)}>
              <ListItemText primary="Keuangan" />
              {openKeuangan ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openKeuangan} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {filteredKeuangan.map((item) => (
                  <ListItemButton key={item.title} sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <item.icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={item.title} primaryTypographyProps={{ fontSize: '0.875rem' }} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </>
        )}
      </List>
    </Drawer>
  );
}
