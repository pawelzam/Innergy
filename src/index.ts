export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

import serviceData from "../assets/services.json";

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
): ServiceType[] => {
    const { type, service } = action;
    if (type === "Select" && !previouslySelectedServices.includes(service)) {
        return [...previouslySelectedServices, service];
    } else if (type === "Deselect") {
        return previouslySelectedServices.filter(s => s !== service);
    }
    return previouslySelectedServices;
};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    let basePrice = 0;
    let finalPrice = 0;

    selectedServices.forEach(service => {
        basePrice += serviceData.services[selectedYear.toString()].individualServices[service];
    });

    const yearBundles = serviceData.services[selectedYear.toString()].bundles;
    yearBundles.forEach(bundle => {
        const isBundleSelected = bundle.services.every(bService => selectedServices.includes(bService as ServiceType));
        if (isBundleSelected && (finalPrice === 0 || bundle.cost < finalPrice)) {
            finalPrice = bundle.cost;
        }
    });

    if (finalPrice === 0) {
        finalPrice = basePrice;
    }

    return { basePrice, finalPrice };
};