import React, { useEffect, useState } from 'react';
import { Bus, Station } from '../interfaces/interface';
import { FaTrash } from "react-icons/fa";
import StationIcon from './StationIcon';

interface LTADialogProps {
    open: boolean;
    onSubmit: (fare: number, description: string) => void;
    onClose: () => void;
    nightMode: boolean;
}

const initialFormData = {
    transportType: '',
    busNumber: '',
    busRoute: '',
    startBusStop: '',
    endBusStop: '',
    startStation: '',
    endStation: '',
    addTripInfo: '',
    tripInfo: '',
};

interface Trip {
    fare: number;
    description: string;
    formData: typeof initialFormData;
}

const LTADialog: React.FC<LTADialogProps> = ({ open, onClose, onSubmit, nightMode }) => {

    const [formData, setFormData] = useState(initialFormData);
    const [stations, setStations] = useState<Station[] | null>(null);
    const [buses, setBuses] = useState<Bus[] | null>(null);
    const [fare, setFare] = useState<number | null>(null);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [totalFare, setTotalFare] = useState<number>(0);

    useEffect(() => {
        const currentTrips = trips.length > 0 ? trips : [{ fare: fare ?? 0, description: createDescription(), formData }];
        const calculatedTotalFare = currentTrips.reduce((acc, trip) => acc + trip.fare, 0);
        setTotalFare(calculatedTotalFare);
    }, [trips, fare]);

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
        resetForm();
    }, []);

    useEffect(() => {
        const calculateFare = async () => {
            let fare = 0;
            let addTripInfo = '0';
            let tripInfo = 'usiAccumulatedDistance1=0-usiAccumulatedDistance2=0-usiAccumulatedDistance3=0-usiAccumulatedDistance4=0-usiAccumulatedDistance5=0-usiAccumulatedDistance6=0-usiAccumulatedFare1=0-usiAccumulatedFare2=0-usiAccumulatedFare3=0-usiAccumulatedFare4=0-usiAccumulatedFare5=0-usiAccumulatedFare6=0';

            // Calculate fare for existing trips
            for (const trip of trips) {
                const result = await calculateFareForTrip(trip.formData, addTripInfo, tripInfo);
                addTripInfo = result.addTripInfo;
                tripInfo = result.tripInfo;
            }

            // Calculate fare for current form data
            if (formData.transportType === 'MRT' && formData.startStation && formData.endStation) {
                const result = await calculateMRTFare(formData.startStation, formData.endStation, addTripInfo, tripInfo);
                fare = result.fare;
                setFormData(prevFormData => ({
                    ...prevFormData,
                    addTripInfo: result.addTripInfo,
                    tripInfo: result.tripInfo,
                }));
            } else if (formData.transportType === 'Bus' && formData.startBusStop && formData.endBusStop && formData.busNumber) {
                const result = await calculateBusFare(formData.startBusStop, formData.endBusStop, formData.busNumber, addTripInfo, tripInfo);
                fare = result.fare;
                setFormData(prevFormData => ({
                    ...prevFormData,
                    addTripInfo: result.addTripInfo,
                    tripInfo: result.tripInfo,
                }));
            }
            setFare(fare);
        };

        calculateFare();
    }, [formData.startStation, formData.endStation, formData.startBusStop, formData.endBusStop, formData.busNumber, formData.transportType, trips]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log(formData, trips[trips.length - 1])
        if (formData.transportType === 'MRT') {
            const lastTrip = trips[trips.length - 1];
            if (lastTrip && formData.startStation !== "" && lastTrip.formData.endStation === formData.startStation && lastTrip.formData.transportType === formData.transportType) {
                setError('*Exit and immediate re-entry at same train station is charged as a new trip. Select another station, or start a new query.');
            } else {
                setError(null);
            }
        } else if (formData.transportType === 'Bus') {
            const lastTrip = trips[trips.length - 1];
            const isSameBusNumber = lastTrip && formData.busNumber !== "" && lastTrip.formData.busNumber === formData.busNumber;
            const isRelatedBusNumber = lastTrip && (
                lastTrip.formData.busNumber.replace(/\D/g, '') === formData.busNumber.replace(/\D/g, '')
            );
            const isSameMode = lastTrip.formData.transportType === formData.transportType

            if (isSameMode && (isSameBusNumber || isRelatedBusNumber)) {
                setError('*Bus service selected has same number as preceding bus service and will be charged as a new trip. Select another bus service, or start a new query.');
            } else {
                setError(null);
            }
        }
    }, [formData.startStation, formData.transportType, formData.busNumber, trips]);

    const calculateFareForTrip = async (formData: typeof initialFormData, addTripInfo: string, tripInfo: string) => {
        if (formData.transportType === 'MRT') {
            return await calculateMRTFare(formData.startStation, formData.endStation, addTripInfo, tripInfo);
        } else if (formData.transportType === 'Bus') {
            return await calculateBusFare(formData.startBusStop, formData.endBusStop, formData.busNumber, addTripInfo, tripInfo);
        }
        return { fare: 0, addTripInfo, tripInfo };
    };

    const calculateMRTFare = async (startStation: string, endStation: string, addTripInfo: string, tripInfo: string) => {
        const payload = new URLSearchParams({
            fare: '30',
            from: startStation,
            to: endStation,
            tripInfo,
            addTripInfo
        });

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/travel/mrt/fare`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: payload.toString(),
        });
        const data = await response.json();
        return {
            fare: parseInt(data.fare, 10) / 100,
            addTripInfo: data.addTripInfo,
            tripInfo: data.tripInfo
        };
    };

    const calculateBusFare = async (startBusStop: string, endBusStop: string, bus: string, addTripInfo: string, tripInfo: string) => {
        const payload = new URLSearchParams({
            fare: '30',
            from: startBusStop,
            to: endBusStop,
            tripInfo,
            addTripInfo,
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
        return {
            fare: parseInt(data.fare, 10) / 100,
            addTripInfo: data.addTripInfo,
            tripInfo: data.tripInfo
        };
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

    const handleAddTrip = () => {
        if (fare !== null) {
            const newTrip = { fare, description: createDescription(), formData };
            if (editingIndex !== null) {
                const updatedTrips = [...trips];
                updatedTrips[editingIndex] = newTrip;
                setTrips(updatedTrips);
                setEditingIndex(null);
            } else {
                setTrips([...trips, newTrip].slice(0, 5));
            }
        }
        resetForm();
    };

    const handleSubmit = () => {
        if (error) {
            return;
        }
        let currentTrips = trips;
        if (trips.length === 0 && fare !== null) {
            const newTrip = { fare, description: createDescription(), formData };
            currentTrips = [newTrip];
        }
        const totalFare = currentTrips.reduce((acc, trip) => acc + trip.fare, 0);
        const descriptions = currentTrips.map(trip => trip.description).join(', ');
        onSubmit(totalFare, descriptions);
        setTrips([]);
        onClose();
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setFare(null);
    };

    const handleDelete = (index: number) => {
        const updatedTrips = trips.filter((_, i) => i !== index);
        setTrips(updatedTrips);
    };

    const getCode = (stationCode: string) => {
        const stationName = stations?.find(station => station.code === stationCode)?.name;
        if (stationName) {
            const match = stationName.match(/\(([^)]+)\)/);
            if (match) {
                return match[1];
            }
        }
        return "";
    };

    const getName = (stationCode: string) => {
        const stationName = stations?.find(station => station.code === stationCode)?.name;
        if (stationName) {
            return stationName.split(' (')[0];
        }
        return "";
    }

    const selectedBus = buses?.find(bus => bus.id === formData.busNumber);
    const selectedRoute = selectedBus?.routes[parseInt(formData.busRoute.split('-')[1])];

    return (
        <>
            <div className={`fixed inset-0 flex items-center justify-center ${nightMode ? 'bg-gray-900' : 'bg-black'} bg-opacity-70 z-20 p-6 ${open ? 'block' : 'hidden'}`}>
                <div className={`${nightMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg w-full max-w-md relative`}>
                    <h2 className={`text-2xl font-semibold ${nightMode ? 'text-gray-200' : 'text-gray-800'} mb-4`}>Add Public Transport Journey</h2>
                    {trips.length > 0 && (
                        <div className="mt-3">
                            <h3 className={`block ${nightMode ? 'text-gray-300' : 'text-gray-700'} text-m font-bold mb-2`}>Trips</h3>
                            <ul>
                                {trips.map((trip, index) => (
                                    <li key={index} className="mb-2 flex justify-between items-center">
                                        <span className={`${nightMode ? 'text-gray-300' : 'text-gray-700'}`}>{trip.description}</span>
                                        <button
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded focus:outline-none focus:shadow-outline ml-2 shadow-md rounded-md"
                                            onClick={() => handleDelete(index)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                            setError(null);
                            resetForm();
                        }}
                    >
                        <label className={`block ${nightMode ? 'text-gray-300' : 'text-gray-700'} text-m font-bold mb-2`} htmlFor="transportType">
                            Transport Mode
                        </label>
                        <select
                            className={`shadow appearance-none border rounded w-full py-2 px-3 ${nightMode ? 'bg-gray-700 text-gray-300' : 'text-gray-700'} leading-tight focus:outline-none focus:shadow-outline mb-3`}
                            id="transportType"
                            name="transportType"
                            value={formData.transportType}
                            onChange={handleChange}
                            required={trips.length === 0}
                        >
                            <option value="" disabled>Select Transport Mode</option>
                            <option value="MRT">MRT</option>
                            <option value="Bus">Bus</option>
                        </select>

                        {formData.transportType === 'MRT' && (
                            <>
                                <label className={`block ${nightMode ? 'text-gray-300' : 'text-gray-700'} text-m font-bold mb-2`} htmlFor="startStation">
                                    Boarding at <span className="text-white">{getName(formData.startStation)}</span> {formData.startStation != '' && (<StationIcon stationCode={getCode(formData.startStation)} />)}
                                </label>
                                <select
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${nightMode ? 'bg-gray-700 text-gray-300' : 'text-gray-700'} leading-tight focus:outline-none focus:shadow-outline mb-3 relative z-10`}
                                    id="startStation"
                                    name="startStation"
                                    value={formData.startStation}
                                    onChange={handleChange}
                                    required={trips.length === 0}
                                    style={{ position: "relative", zIndex: 1 }}
                                >
                                    <option value="">Select MRT/LRT Station</option>
                                    {stations?.filter(station => station.code !== formData.endStation).map(station => (
                                        <option key={station.code} value={station.code}>{station.name}</option>
                                    ))}
                                </select>
                                {error && <p className="text-red-500 text-sm italic mb-2">{error}</p>}

                                <label className={`block ${nightMode ? 'text-gray-300' : 'text-gray-700'} text-m font-bold mb-2`} htmlFor="endStation">
                                    Alighting at <span className="text-white">{getName(formData.endStation)}</span> {formData.endStation != '' && (<StationIcon stationCode={getCode(formData.endStation)} />)}
                                </label>
                                <select
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${nightMode ? 'bg-gray-700 text-gray-300' : 'text-gray-700'} leading-tight focus:outline-none focus:shadow-outline mb-3 relative z-10`}
                                    id="endStation"
                                    name="endStation"
                                    value={formData.endStation}
                                    onChange={handleChange}
                                    required={trips.length === 0}
                                    style={{ position: "relative", zIndex: 1 }}
                                >
                                    <option value="">Select MRT/LRT Station</option>
                                    {stations?.filter(station => station.code !== formData.startStation).map(station => (
                                        <option key={station.code} value={station.code}>{station.name}</option>
                                    ))}
                                </select>
                            </>
                        )}

                        {formData.transportType === 'Bus' && (
                            <>
                                <label className={`block ${nightMode ? 'text-gray-300' : 'text-gray-700'} text-m font-bold mb-2`} htmlFor="busNumber">
                                    Bus Number
                                </label>
                                <select
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${nightMode ? 'bg-gray-700 text-gray-300' : 'text-gray-700'} leading-tight focus:outline-none focus:shadow-outline mb-3`}
                                    id="busNumber"
                                    name="busNumber"
                                    value={formData.busNumber}
                                    onChange={handleChange}
                                    required={trips.length === 0}
                                >
                                    <option value="" disabled>Select Bus Service Number</option>
                                    {buses?.map(bus => (
                                        <option key={bus.id} value={bus.id}>{bus.id}</option>
                                    ))}
                                </select>
                                {error && <p className="text-red-500 text-sm italic mb-2">{error}</p>}

                                <label className={`block ${nightMode ? 'text-gray-300' : 'text-gray-700'} text-m font-bold mb-2`} htmlFor="busRoute">
                                    Direction
                                </label>
                                <select
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${nightMode ? 'bg-gray-700 text-gray-300' : 'text-gray-700'} leading-tight focus:outline-none focus:shadow-outline mb-3`}
                                    id="busRoute"
                                    name="busRoute"
                                    value={formData.busRoute}
                                    onChange={handleChange}
                                    required={trips.length === 0}
                                >
                                    <option value="" disabled>Select Direction</option>
                                    {selectedBus?.routes.map((route, index) => (
                                        <option key={`${formData.busNumber}-${index}`} value={`${formData.busNumber}-${index}`}>{route.description}</option>
                                    ))}
                                </select>

                                <label className={`block ${nightMode ? 'text-gray-300' : 'text-gray-700'} text-m font-bold mb-2`} htmlFor="startBusStop">
                                    Boarding at
                                </label>
                                <select
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${nightMode ? 'bg-gray-700 text-gray-300' : 'text-gray-700'} leading-tight focus:outline-none focus:shadow-outline mb-3`}
                                    id="startBusStop"
                                    name="startBusStop"
                                    value={formData.startBusStop}
                                    onChange={handleChange}
                                    required={trips.length === 0}
                                >
                                    <option value="" disabled>Select Bus Stop</option>
                                    {selectedRoute?.busStops.map(busStop => (
                                        <option key={busStop.id} value={busStop.id}>{busStop.name}</option>
                                    ))}
                                </select>

                                <label className={`block ${nightMode ? 'text-gray-300' : 'text-gray-700'} text-m font-bold mb-2`} htmlFor="endBusStop">
                                    Alighting at
                                </label>
                                <select
                                    className={`shadow appearance-none border rounded w-full py-2 px-3 ${nightMode ? 'bg-gray-700 text-gray-300' : 'text-gray-700'} leading-tight focus:outline-none focus:shadow-outline mb-3`}
                                    id="endBusStop"
                                    name="endBusStop"
                                    value={formData.endBusStop}
                                    onChange={handleChange}
                                    required={trips.length === 0}
                                >
                                    <option value="" disabled>Select Bus Stop</option>
                                    {selectedRoute?.busStops
                                        .slice(selectedRoute.busStops.findIndex(busStop => busStop.id === formData.startBusStop) + 1)
                                        .map(busStop => (
                                            <option key={busStop.id} value={busStop.id}>{busStop.name}</option>
                                        ))}
                                </select>
                            </>
                        )}

                        {trips.length > 0 ? (<h2 className={`text-xl font-bold mb-2 ${nightMode ? 'text-gray-200' : 'text-gray-800'}`}>Total Fare: ${(totalFare ?? 0).toFixed(2)}</h2>) :
                            <h2 className={`text-xl font-bold ${nightMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>Fare: ${(fare ?? 0).toFixed(2)}</h2>}

                        <button
                            type="button"
                            onClick={handleAddTrip}
                            className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold mt-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-opacity duration-300 ${error ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
                            disabled={error !== null}
                        >
                            {trips.length == 0 ? 'Add More Trips' : 'Add to Journey'}
                        </button>
                        <div className="flex items-center justify-between mt-4">
                            <button
                                type="button"
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => { resetForm(); setTrips([]); setError(null); onClose(); }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={error !== null}
                                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-opacity duration-300 ${error ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
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