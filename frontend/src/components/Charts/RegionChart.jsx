import React from 'react';
import Chart from 'react-apexcharts';
import { Paper, Typography, useTheme } from '@mui/material';

const RegionChart = ({ data }) => {
    const theme = useTheme();

    const chartOptions = {
        labels: data.map(item => item.name),
        chart: {
            type: 'pie',
            background: 'transparent',
            toolbar: {
                show: false
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 300,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 300
                }
            }
        },
        theme: {
            mode: theme.palette.mode,
        },
        legend: {
            position: 'bottom',
            labels: {
                colors: theme.palette.text.primary,
            }
        },
        tooltip: {
            y: {
                formatter: function (value) {
                    return "₹" + value.toLocaleString('en-IN');
                }
            }
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        ]
    };

    const series = data.map(item => item.value);

    return (
        <Paper elevation={3} sx={{ p: 3, height: 400, borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom color="primary">
                Revenue by Region
            </Typography>
            <div style={{ flexGrow: 1, minHeight: 0 }}>
                <Chart
                    options={chartOptions}
                    series={series}
                    type="pie"
                    width="100%"
                    height="100%"
                />
            </div>
        </Paper>
    );
};

export default RegionChart;
