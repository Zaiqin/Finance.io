import React, { useEffect, useState } from 'react';
import { Bus, Station } from '../interfaces/interface';

interface LTADialogProps {
    open: boolean;
    onSubmit: (fare: number, description: string ) => void;
    onClose: () => void;
}

const LTADialog: React.FC<LTADialogProps> = ({ open, onClose, onSubmit }) => {
    const initialFormData = {
        transportType: '',
        busNumber: '',
        busRoute: '',
        startBusStop: '',
        endBusStop: '',
        startStation: '',
        endStation: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [stations, setStations] = useState<Station[] | null>(null);
    const [buses, setBuses] = useState<Bus[] | null>(null);
    const [fare, setFare] = useState<number | null>(null);

    useEffect(() => {
        const fetchStations = async () => {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/travel/mrt`);
            const data = await response.json();
            setStations(data);
        };

        const fetchBuses = async () => {
            const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/travel/bus`);
            const data = await response.json();
            const parsedBuses = data.map((bus: any) => ({
                id: bus[0],
                routes: bus.slice(1)
            }));
            setBuses(parsedBuses);
        };

        fetchStations();
        fetchBuses();
    }, []);

    useEffect(() => {
        const calculateFare = async () => {
            let fare = 0;
            if (formData.transportType === 'MRT' && formData.startStation && formData.endStation) {
                fare = await calculateMRTFare(formData.startStation, formData.endStation);
            } else if (formData.transportType === 'Bus' && formData.startBusStop && formData.endBusStop && formData.busNumber) {
                fare = await calculateBusFare(formData.startBusStop, formData.endBusStop, formData.busNumber);
            }
            setFare(fare);
        };

        calculateFare();
    }, [formData.startStation, formData.endStation, formData.startBusStop, formData.endBusStop, formData.busNumber, formData.transportType]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const calculateMRTFare = async (startStation: string, endStation: string) => {
        const payload = new URLSearchParams({
            fare: '30',
            from: startStation,
            to: endStation,
            tripInfo: 'usiAccumulatedDistance1=0-usiAccumulatedDistance2=0-usiAccumulatedDistance3=0-usiAccumulatedDistance4=0-usiAccumulatedDistance5=0-usiAccumulatedDistance6=0-usiAccumulatedFare1=0-usiAccumulatedFare2=0-usiAccumulatedFare3=0-usiAccumulatedFare4=0-usiAccumulatedFare5=0-usiAccumulatedFare6=0',
            addTripInfo: '0'
        });

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/travel/mrt/fare`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: payload.toString(),
        });
        const data = await response.json();
        return parseInt(data.fare, 10) / 100;
    };

    const calculateBusFare = async (startBusStop: string, endBusStop: string, bus: string) => {
        const payload = new URLSearchParams({
            fare: '30',
            from: startBusStop,
            to: endBusStop,
            tripInfo: 'usiAccumulatedDistance1=0-usiAccumulatedDistance2=0-usiAccumulatedDistance3=0-usiAccumulatedDistance4=0-usiAccumulatedDistance5=0-usiAccumulatedDistance6=0-usiAccumulatedFare1=0-usiAccumulatedFare2=0-usiAccumulatedFare3=0-usiAccumulatedFare4=0-usiAccumulatedFare5=0-usiAccumulatedFare6=0',
            addTripInfo: '0',
            bus: bus
        });

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/travel/bus/fare`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: payload.toString(),
        });
        const data = await response.json();
        return parseInt(data.fare, 10) / 100;
    };

    const createDescription = () => {
        if (formData.transportType === 'MRT') {
            const startStationName = stations?.find(station => station.code === formData.startStation)?.name;
            const endStationName = stations?.find(station => station.code === formData.endStation)?.name;
            return `MRT: ${startStationName} - ${endStationName}`;
        } else if (formData.transportType === 'Bus') {
            const startBusStopName = selectedRoute?.busStops.find(busStop => busStop.id === formData.startBusStop)?.name;
            const endBusStopName = selectedRoute?.busStops.find(busStop => busStop.id === formData.endBusStop)?.name;
            return `Bus ${formData.busNumber}: ${startBusStopName} - ${endBusStopName}`;
        }
        return '';
    };

    const handleSubmit = async () => {
        // Handle form submission logic here
        console.log(fare)
        console.log({ ...formData, fare });
        onClose();
        if (fare !== null) {
            onSubmit(fare, createDescription());
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setFare(null);
    };

    const selectedBus = buses?.find(bus => bus.id === formData.busNumber);
    const selectedRoute = selectedBus?.routes[parseInt(formData.busRoute.split('-')[1])];

    return (
        <>
            <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 p-6 ${open ? 'block' : 'hidden'}`}>
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Public Transport</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <label className="block text-gray-700 text-m font-bold mb-2" htmlFor="transportType">
                            Transport Type
                        </label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
                            id="transportType"
                            name="transportType"
                            value={formData.transportType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Transport Type</option>
                            <option value="MRT">MRT</option>
                            <option value="Bus">Bus</option>
                        </select>

                        {formData.transportType === 'MRT' && (
                            <>
                                <label className="block text-gray-700 text-m font-bold mb-2" htmlFor="startStation">
                                    Starting Station
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3 relative z-10"
                                    id="startStation"
                                    name="startStation"
                                    value={formData.startStation}
                                    onChange={handleChange}
                                    required
                                    style={{ position: "relative", zIndex: 1 }}
                                >
                                    <option value="">Select Starting Station</option>
                                    {stations?.map(station => (
                                        <option key={station.code} value={station.code}>{station.name}</option>
                                    ))}
                                </select>

                                <label className="block text-gray-700 text-m font-bold mb-2" htmlFor="endStation">
                                    Ending Station
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3 relative z-10"
                                    id="endStation"
                                    name="endStation"
                                    value={formData.endStation}
                                    onChange={handleChange}
                                    required
                                    style={{ position: "relative", zIndex: 1 }}
                                >
                                    <option value="">Select Ending Station</option>
                                    {stations?.map(station => (
                                        <option key={station.code} value={station.code}>{station.name}</option>
                                    ))}
                                </select>
                            </>
                        )}

                        {formData.transportType === 'Bus' && (
                            <>
                                <label className="block text-gray-700 text-m font-bold mb-2" htmlFor="busNumber">
                                    Bus Number
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
                                    id="busNumber"
                                    name="busNumber"
                                    value={formData.busNumber}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Bus Number</option>
                                    {buses?.map(bus => (
                                        <option key={bus.id} value={bus.id}>{bus.id}</option>
                                    ))}
                                </select>

                                <label className="block text-gray-700 text-m font-bold mb-2" htmlFor="busRoute">
                                    Bus Route
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
                                    id="busRoute"
                                    name="busRoute"
                                    value={formData.busRoute}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Bus Route</option>
                                    {selectedBus?.routes.map((route, index) => (
                                        <option key={`${formData.busNumber}-${index}`} value={`${formData.busNumber}-${index}`}>{route.description}</option>
                                    ))}
                                </select>

                                <label className="block text-gray-700 text-m font-bold mb-2" htmlFor="startBusStop">
                                    Starting Bus Stop
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
                                    id="startBusStop"
                                    name="startBusStop"
                                    value={formData.startBusStop}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Starting Bus Stop</option>
                                    {selectedRoute?.busStops.map(busStop => (
                                        <option key={busStop.id} value={busStop.id}>{busStop.name}</option>
                                    ))}
                                </select>

                                <label className="block text-gray-700 text-m font-bold mb-2" htmlFor="endBusStop">
                                    Ending Bus Stop
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
                                    id="endBusStop"
                                    name="endBusStop"
                                    value={formData.endBusStop}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Ending Bus Stop</option>
                                    {selectedRoute?.busStops.map(busStop => (
                                        <option key={busStop.id} value={busStop.id}>{busStop.name}</option>
                                    ))}
                                </select>
                            </>
                        )}

                        {fare !== null && (
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Fare: ${fare}</h2>
                        )}

                        <div className="flex items-center justify-between mt-4">
                            <button
                                type="button"
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LTADialog;