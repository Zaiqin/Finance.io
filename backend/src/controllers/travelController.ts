import { Request, Response } from 'express';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

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
