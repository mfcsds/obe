"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { alumniData } from '@/lib/mock-alumni-data';

export default function WaktuTungguChart() {
    return (
        <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    Waktu Tunggu Lulusan
                </Typography>
                <Box sx={{ height: 300, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={alumniData.waktuTunggu}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {alumniData.waktuTunggu.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
}
