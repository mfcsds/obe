"use client";

import { Card, CardContent, Typography, Box } from '@mui/material';
import { People, Timer, Work, ThumbUp } from '@mui/icons-material';
import { alumniData } from '@/lib/mock-alumni-data';

const stats = [
    { label: 'Total Alumni (TS-4 s.d TS)', value: alumniData.stats.totalAlumni, icon: People, color: '#1976d2' },
    { label: 'Rata-rata Waktu Tunggu', value: alumniData.stats.avgWaitingTime, icon: Timer, color: '#ed6c02' },
    { label: 'Tingkat Pekerjaan', value: `${alumniData.stats.employed}%`, icon: Work, color: '#2e7d32' },
    { label: 'Response Rate', value: `${alumniData.stats.responseRate}%`, icon: ThumbUp, color: '#9c27b0' },
];

export default function AlumniStatsCards() {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 3 }}>
            {stats.map((stat) => (
                <Card elevation={2} key={stat.label}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {stat.label}
                                </Typography>
                            </Box>
                            <stat.icon sx={{ fontSize: 40, color: stat.color, opacity: 0.8 }} />
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
