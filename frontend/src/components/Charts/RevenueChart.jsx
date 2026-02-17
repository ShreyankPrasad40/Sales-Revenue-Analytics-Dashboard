import React from 'react';
import Chart from 'react-apexcharts';
import { Paper, Typography, useTheme } from '@mui/material';

const RevenueChart = ({ data }) => {
    const theme = useTheme();


    const chartOptions = {
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            },
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
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight',
            colors: [theme.palette.secondary.main]
        },
        title: {
            text: 'Revenue Trends',
            align: 'left',
            style: {
                color: theme.palette.text.primary
            }
        },
        grid: {
            row: {
                colors: [theme.palette.mode === 'dark' ? '#333' : '#f3f3f3', 'transparent'],
                opacity: 0.5
            },
            borderColor: theme.palette.divider
        },
        xaxis: {
            categories: data.map(item => item.period),
            labels: {
                style: {
                    colors: theme.palette.text.secondary
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: theme.palette.text.secondary
                },
                formatter: (value) => `₹${value.toLocaleString('en-IN')}`
            }
        },
        theme: {
            mode: theme.palette.mode
        },
        tooltip: {
            y: {
                formatter: (value) => `₹${value.toLocaleString('en-IN')}`
            }
        }
    };

    const series = [{
        name: "Revenue",
        data: data.map(item => item.revenue)
    }];

    return (
        <Paper elevation={3} sx={{ p: 3, height: 400, borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
                <Chart
                    options={chartOptions}
                    series={series}
                    type="line"
                    height="100%"
                    width="100%"
                />
            </div>
        </Paper>
    );
};

export default RevenueChart;
