import React, { useEffect, useState } from 'react';

interface Station {
  code: string;
  name: string;
}

interface Bus {
  id: string;
  route: string;
}

const TransportFees: React.FC = () => {
  const [stations, setStations] = useState<Station[] | null>(null);
  const [buses, setBuses] = useState<Bus[] | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      const response = await fetch('http://localhost:8000/api/travel/mrt');
      const data = await response.json();
      setStations(data);
      console.log(data);
    };

    const fetchBuses = async () => {
      const response = await fetch('http://localhost:8000/api/travel/bus');
      const data = await response.json();
      setBuses(data);
      console.log(data);
    };

    fetchStations();
    fetchBuses();
  }, []);

  return (<></>);
};

export default TransportFees;
