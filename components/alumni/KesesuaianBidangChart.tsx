"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { alumniData } from '@/lib/mock-alumni-data';

export default function KesesuaianBidangChart() {
    return (
        <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    Kesesuaian Bidang Kerja
                </Typography>
                <Box sx={{ height: 300, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={alumniData.kesesuaianBidang}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" name="Persentase (%)">
                                {alumniData.kesesuaianBidang.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
}
