"use client";

import { Box, Container, Typography, Alert } from '@mui/material';
import AlumniStatsCards from '@/components/alumni/AlumniStatsCards';
import WaktuTungguChart from '@/components/alumni/WaktuTungguChart';
import KesesuaianBidangChart from '@/components/alumni/KesesuaianBidangChart';
import KepuasanPenggunaChart from '@/components/alumni/KepuasanPenggunaChart';

export default function AlumniPage() {
    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                    Dashboard Alumni & Tracer Study
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Analisis data lulusan berdasarkan standar akreditasi LAM INFOKOM (TS-4 s.d TS)
                </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 4 }}>
                Data yang ditampilkan mencakup lulusan dari tahun TS-4 hingga TS (5 tahun terakhir).
            </Alert>

            <AlumniStatsCards />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 3 }}>
                <Box>
                    <WaktuTungguChart />
                </Box>
                <Box>
                    <KesesuaianBidangChart />
                </Box>
                <Box sx={{ gridColumn: { xs: '1', md: '1 / -1', lg: 'auto' } }}>
                    <KepuasanPenggunaChart />
                </Box>
            </Box>
        </Container>
    );
}
