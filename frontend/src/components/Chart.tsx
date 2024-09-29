import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import ChartSettingsDialog from './ChartSettingsDialog'; // Import the dialog
import { FaCog } from 'react-icons/fa';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    GridLineOptions,
} from "chart.js";

interface Finance {
    category: string;
    amount: number;
    description: string;
}

// Register the necessary elements and scales
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

interface ChartProps {
    data: {
        labels: string[]; // Labels will hold the dates
        datasets: {
            label: string;
            data: number[];
            backgroundColor?: string;
            borderColor?: string;
            borderWidth?: number;
        }[];
    };
    groupedFinances: { [key: string]: Finance[] }; // Pass grouped finances
}

const formatLabel = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

const formatLabelShort = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
};

const ChartComponent: React.FC<ChartProps> = ({ data, groupedFinances }) => {
    const [lineColor, setLineColor] = useState<string>('#3b82f6');
    const [lineThickness, setLineThickness] = useState<number>(3); // Added state for line thickness
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [startDate, setStartDate] = useState<string | undefined>(undefined);
    const [endDate, setEndDate] = useState<string | undefined>(undefined);
    const [numPeriods, setNumPeriods] = useState<number>(1); // State for number of periods
    const [dateType, setDateType] = useState<'months' | 'weeks'>('months'); // State for date type
    const [includeFuture, setIncludeFuture] = useState<boolean>(false); // State for including future finances

    const handleColorChange = (color: { hex: string; thickness: number }) => {
        setLineColor(color.hex);
        setLineThickness(color.thickness); // Update line thickness
    };

    const filterDataByPeriods = () => {
        const end = includeFuture ? new Date(Math.max(...data.labels.map(label => new Date(label).getTime()))) : new Date();
        let start: Date;

        if (dateType === 'months') {
            start = new Date(end.getFullYear(), end.getMonth() - numPeriods, end.getDate());
        } else {
            start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - (numPeriods * 7));
        }

        const filteredLabels = data.labels.filter(label => {
            const date = new Date(label);
            return date >= start && date <= end;
        });

        const filteredDatasets = data.datasets.map(dataset => {
            const filteredData = dataset.data.filter((_, index) => {
                const date = new Date(data.labels[index]);
                return date >= start && date <= end;
            });
            return { ...dataset, data: filteredData };
        });

        return { labels: filteredLabels, datasets: filteredDatasets };
    };

    const filteredData = filterDataByPeriods();

    const handlePointClick = (event: any, elements: any[]) => {
        if (elements.length > 0) {
            const { datasetIndex, index } = elements[0];
            const label = filteredData.labels[index];
            const value = filteredData.datasets[datasetIndex].data[index];
            const finances = groupedFinances[label] || [];
            console.log(`Clicked on point: ${label} - $${value}\nDetails:\n${finances.map(finance => `${finance.category}: $${finance.amount.toFixed(2)} (${finance.description})`).join('\n')}`);
        }
    };

    const options = {
        scales: {
            x: {
                type: 'category' as const,
                grid: {
                    drawBorder: true,
                    borderWidth: 2 as const,
                } as Partial<GridLineOptions>,
                ticks: {
                    autoSkip: true,
                    maxRotation: 0,
                    callback: (value: string | number) => {
                        const date = formatLabelShort(filteredData.labels[+value]); // Format label using the filtered date
                        return date;
                    },
                },
            },
            y: {
                type: 'linear' as const,
                grid: {
                    drawBorder: true,
                    borderWidth: 2 as const,
                } as Partial<GridLineOptions>,
                ticks: {
                    autoSkip: true,
                    maxRotation: 0,
                    callback: (value: string | number) => {
                        return `$${(+value).toFixed(2)}`; // Format value as 2dp currency
                    },
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: (tooltipItems: any[]) => {
                        const date = formatLabel(tooltipItems[0].label); // Get the hovered date
                        return date; // Display the date as the title
                    },
                    label: (tooltipItem: any) => {
                        const date = tooltipItem.label; // Get the date from the tooltip item
                        const total = tooltipItem.raw; // Get the total amount
                        const finances = groupedFinances[date] || []; // Get finances for the date

                        // Create an array of labels to display in the tooltip
                        const labels = [` Total: $${total.toFixed(2)}`];
                        finances.forEach(finance => {
                            const description = finance.description ? ` (${finance.description})` : '';
                            labels.push(`• ${finance.category}: $${finance.amount.toFixed(2)}${description}`);
                        });
                        return labels; // Return the array of labels
                    },
                },
            },
        },
        onClick: handlePointClick, // Add the onClick handler
    };

    // Update the datasets with the color and thickness props
    const updatedData = {
        ...filteredData,
        datasets: filteredData.datasets.map(dataset => ({
            ...dataset,
            borderColor: lineColor,
            borderWidth: lineThickness, // Use the line thickness from state
        })),
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl mb-3 font-semibold text-gray-800 text-center">Expenditure Chart</h2>
            <Line data={updatedData} options={options} />

            {/* Chart Settings Dialog */}
            <ChartSettingsDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onChangeComplete={handleColorChange}
                selectedColor={lineColor}
                onResetToDefault={() => {
                    setLineColor('#3b82f6');
                    setLineThickness(3);
                    setStartDate(undefined);
                    setEndDate(undefined);
                    setNumPeriods(1);
                    setDateType('months');
                    setIncludeFuture(false); // Reset include future
                }}
                lineThickness={lineThickness} // Pass the thickness to the dialog
                startDate={startDate}
                endDate={endDate}
                onDateChange={setStartDate} // Passing setStartDate and setEndDate for handling date changes
                numPeriods={numPeriods}
                dateType={dateType}
                onNumPeriodsChange={setNumPeriods}
                onDateTypeChange={setDateType}
                includeFuture={includeFuture} // Pass includeFuture to the dialog
                onIncludeFutureChange={setIncludeFuture} // Pass the setter function to the dialog
            />
            <br />
            <div className="mb-2 flex items-center justify-between">
                <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                    type="button"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <FaCog className="mr-2" /> <span>Chart Settings</span>
                </button>
            </div>
        </div>
    );
};

export default ChartComponent;
