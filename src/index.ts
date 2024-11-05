import { ServiceYear } from './models/service-year'
import { ServiceType } from './models/service-type';
import { ServiceData } from './models/service-data';

import services from "../assets/services.json";

const serviceData = services as ServiceData;

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
): ServiceType[] => {
    const { type, service } = action;
    const hasMainService = serviceData.mainServices.some(mainService => 
        previouslySelectedServices.includes(mainService as ServiceType)
    );

    const isMainService = serviceData.mainServices.includes(service);
    if (!hasMainService && !isMainService) {
        return previouslySelectedServices;
    }

    switch (type) {
        case "Select":
            return previouslySelectedServices.includes(service)
                ? previouslySelectedServices
                : [...previouslySelectedServices, service];

        case "Deselect":
            const newSelectedServices = previouslySelectedServices.filter(s => s !== service);
            return serviceData.mainServices.some(mainService => 
                newSelectedServices.includes(mainService as ServiceType)
            )
                ? newSelectedServices
                : newSelectedServices.filter(s => !serviceData.extraServices.includes(s));

        default:
            return previouslySelectedServices;
    }
};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    let basePrice = 0;
    let finalPrice = 0;

    const yearPrices = serviceData.prices[selectedYear.toString()];
    if (!yearPrices) {
        throw new Error(`Pricing data for the year ${selectedYear} is not available.`);     
    }

    selectedServices.forEach(service => {
        basePrice += yearPrices.individualServices[service];
    });

    const yearBundles = yearPrices.bundles;
    yearBundles.forEach(bundle => {
        const bundleExists = 
            bundle.services.every(service => selectedServices.includes(service as ServiceType)) &&
            selectedServices.every(service => bundle.services.includes(service as ServiceType));

        if (bundleExists) {
            finalPrice = finalPrice === 0 ? bundle.cost : Math.min(finalPrice, bundle.cost);
        }
    });

    if (finalPrice === 0) {
        finalPrice = basePrice;
    }

    return { basePrice, finalPrice };
};