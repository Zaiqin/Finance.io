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
        const formData = qs.stringify({
            fare,
            from,
            to,
            tripInfo,
            addTripInfo,
        });

        const response = await axios.post(
            'https://www.lta.gov.sg/content/ltagov/en/map/fare-calculator/jcr:content/map2-content/farecalculator.mrtget.html',
            formData, // Make sure the data is being sent as `application/x-www-form-urlencoded`
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36', // Similar to Postman or browser
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Referer': 'https://www.lta.gov.sg/content/ltagov/en/map/fare-calculator.html', // Important if the API checks referer
                    'Origin': 'https://www.lta.gov.sg', // The origin to match the actual site
                    'X-Requested-With': 'XMLHttpRequest', // Mimicking XMLHttpRequest behavior
                },                
            }
        );

        console.log(response.data); // Check the response
        res.json(response.data);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server Error');
    }
};


export const calculateBusFare = async (req: Request, res: Response) => {
    const { fare, from, to, tripInfo, addTripInfo, bus } = req.body;

    try {
        const response = await axios.post('https://www.lta.gov.sg/content/ltagov/en/map/fare-calculator/jcr:content/map2-content/farecalculator.busget.html', null, {
            params: {
                fare,
                from,
                to,
                tripInfo,
                addTripInfo,
                bus
            }
        });

        res.json(response.data);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server Error');
    }
};