export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

import serviceData from "../assets/services.json";

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
                : newSelectedServices.filter(s => !serviceData.relatedServices.includes(s));

        default:
            return previouslySelectedServices;
    }
};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    let basePrice = 0;
    let finalPrice = 0;

    selectedServices.forEach(service => {
        basePrice += serviceData.prices[selectedYear.toString()].individualServices[service];
    });

    const yearBundles = serviceData.prices[selectedYear.toString()].bundles;
    yearBundles.forEach(bundle => {
        const isBundleSelected = 
            bundle.services.every(bService => selectedServices.includes(bService as ServiceType)) &&
            selectedServices.every(sService => bundle.services.includes(sService as ServiceType));


        if (isBundleSelected) {
            finalPrice = finalPrice === 0 ? bundle.cost : Math.min(finalPrice, bundle.cost);
        }
    });

    if (finalPrice === 0) {
        finalPrice = basePrice;
    }

    return { basePrice, finalPrice };
};