//Natalie Kanyuchi
//Student id number: 23198994
//description: this file has a shared calculation helper for the web application
//it contains the vehicle price multipliers and 
//it is also a resubale funtion used to estimate trip fares 
//based on suburb zones plus the car type

import { suburbZones } from "./Suburbs";

export const carTypeMultiplier ={
    Standard: 1,
    Premium: 1.40,
    Van: 1.7,
};

export function calculateEstimatedFare(pickup, destination, carType){
    const pickupZone = suburbZones[pickup];
    const destinationZone = suburbZones [destination];

    if (!pickupZone || !destinationZone){
        return null;
    }
    const zoneDifference = Math.abs(pickupZone - destinationZone);
    const baseFare = 12;
    const distanceFare = zoneDifference * 4.5;
    const estimatedFare = (baseFare + distanceFare) * carTypeMultiplier[carType];

    return estimatedFare.toFixed(2);
}