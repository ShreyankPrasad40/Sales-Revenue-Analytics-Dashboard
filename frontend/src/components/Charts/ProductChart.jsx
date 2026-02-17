import React from 'react';
import Chart from 'react-apexcharts';
import { Paper, Typography, useTheme } from '@mui/material';

const ProductChart = ({ data }) => {
    const theme = useTheme();


    const chartHeight = Math.max(350, data.length * 50);

    const chartOptions = {
        chart: {
            type: 'bar',
            height: chartHeight,
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
            },
            background: 'transparent'
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                borderRadiusApplication: 'end',
                horizontal: true,
                barHeight: '80%',
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: data.map(item => item.name.length > 25 ? item.name.substring(0, 25) + '...' : item.name),
            labels: {
                style: {
                    colors: theme.palette.text.secondary
                },
                formatter: (value) => {

                    const val = Number(value);
                    return isNaN(val) ? value : `₹${val.toLocaleString('en-IN')}`;
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: theme.palette.text.secondary,
                },
                maxWidth: 180
            }
        },
        grid: {
            borderColor: theme.palette.divider,
            xaxis: {
                lines: {
                    show: true
                }
            }
        },
        theme: {
            mode: theme.palette.mode,
        },
        colors: [theme.palette.info.main],
        tooltip: {
            y: {
                formatter: (val) => `₹${Number(val).toLocaleString('en-IN')}`
            }
        }
    };

    const series = [{
        name: 'Sales',
        data: data.map(item => item.value)
    }];

    return (
        <Paper elevation={3} sx={{ p: 3, height: 500, borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom color="primary">
                Product-wise sales
            </Typography>
            <div style={{ flexGrow: 1, width: '100%', overflowY: 'auto', paddingRight: '10px' }}>
                <Chart
                    options={chartOptions}
                    series={series}
                    type="bar"
                    height={chartHeight}
                    width="100%"
                />
            </div>
        </Paper>
    );
};

export default ProductChart;
