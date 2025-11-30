"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { alumniData } from '@/lib/mock-alumni-data';

export default function KepuasanPenggunaChart() {
    return (
        <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    Tingkat Kepuasan Pengguna
                </Typography>
                <Box sx={{ height: 300, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={alumniData.kepuasanPengguna}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 5]} />
                            <Radar
                                name="Skor"
                                dataKey="A"
                                stroke="#8884d8"
                                fill="#8884d8"
                                fillOpacity={0.6}
                            />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
}
