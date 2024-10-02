import { Request, Response } from 'express';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import qs from 'qs';

export const getMRT = async (req: Request, res: Response) => {
    try {
        const response = await axios.get('https://www.lta.gov.sg/map/fareCalculator/mrtTripIndex.xml');
        const xmlData = response.data;

        const result = await parseStringPromise(xmlData);
        const mrtStops = result.mrtTripFareCalc.mrtStop.map((stop: any) => {
            const [code] = stop.$.value.split('_');
            const name = stop._;
            return { code, name };
        });

        res.json(mrtStops);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server Error');
    }
};

export const getBus = async (req: Request, res: Response) => {
    try {
        const response = await axios.get('https://www.lta.gov.sg/map/fareCalculator/busTripIndex.xml');
        const xmlData = response.data;

        const result = await parseStringPromise(xmlData);
        const busDirections = result.busTripFareCalc.bus.map((bus: any) => {
            const busNo = bus.$.id;
            const directions = bus.direction.map((direction: any) => {
                const description = direction.description[0];
                const busStops = direction.busStop.map((stop: any) => {
                    const [id, code, order] = stop.$.id.split('_');
                    const name = stop._;
                    return { id, code, order, name };
                });
                return { description, busStops };
            });
            return [busNo, ...directions];
        });

        res.json(busDirections);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server Error');
    }
};

export const calculateMRTFare = async (req: Request, res: Response) => {
    const { fare, from, to, tripInfo, addTripInfo } = req.body;

    try {
        const response = await axios.post('https://www.lta.gov.sg/content/ltagov/en/map/fare-calculator/jcr:content/map2-content/farecalculator.mrtget.html', qs.stringify({
            fare,
            from,
            to,
            tripInfo,
            addTripInfo
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        res.json(response.data);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server Error');
    }
};

export const calculateBusFare = async (req: Request, res: Response) => {
    const { fare, from, to, tripInfo, addTripInfo, bus } = req.body;

    try {
        const response = await axios.post('https://www.lta.gov.sg/content/ltagov/en/map/fare-calculator/jcr:content/map2-content/farecalculator.busget.html', qs.stringify({
            fare,
            from,
            to,
            tripInfo,
            addTripInfo,
            bus
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        res.json(response.data);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server Error');
    }
};