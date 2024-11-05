import { ServiceYear } from "./models/service-year";
import { ServiceType } from "./models/service-type";
import { ServiceData } from "./models/service-data";

import services from "../assets/services.json";

const serviceData = services as ServiceData;

export const updateSelectedServices = (
  previouslySelectedServices: ServiceType[],
  action: { type: "Select" | "Deselect"; service: ServiceType }
): ServiceType[] => {
  const { type, service } = action;

  if (!isServiceAllowed(previouslySelectedServices, service)) {
    return previouslySelectedServices;
  }

  const hasMainService = isMainServiceSelected(previouslySelectedServices);
  const isMainService = serviceData.mainServices.includes(service);
  if (!hasMainService && !isMainService) {
    return previouslySelectedServices;
  }

  switch (type) {
    case "Select":
      return selectService(previouslySelectedServices, service);

    case "Deselect":
      return deselectService(previouslySelectedServices, service);

    default:
      return previouslySelectedServices;
  }
};

export const calculatePrice = (
  selectedServices: ServiceType[],
  selectedYear: ServiceYear
) => {
  const yearPrices = getYearPrices(selectedYear);

  if (!hasMainService(selectedServices)) {
    return { basePrice: 0, finalPrice: 0 };
  }

  const basePrice = calculateBasePrice(selectedServices, yearPrices);
  const bestBundlePrice = getBestBundlePrice(
    selectedServices,
    yearPrices.bundles
  );

  const finalPrice =
    bestBundlePrice === 0 ? basePrice : Math.min(basePrice, bestBundlePrice);

  return { basePrice, finalPrice };
};

const isServiceAllowed = (
  previouslySelectedServices: ServiceType[],
  service: ServiceType
): boolean => {
  const extraService = serviceData.extraServices.find(
    (e) => e.service === service
  );
  return (
    !extraService ||
    extraService.requires.some((required) =>
      previouslySelectedServices.includes(required)
    )
  );
};

const isMainServiceSelected = (selectedServices: ServiceType[]): boolean => {
  return serviceData.mainServices.some((mainService) =>
    selectedServices.includes(mainService as ServiceType)
  );
};

const selectService = (
  selectedServices: ServiceType[],
  service: ServiceType
): ServiceType[] => {
  return selectedServices.includes(service)
    ? selectedServices
    : [...selectedServices, service];
};

const deselectService = (
  selectedServices: ServiceType[],
  service: ServiceType
): ServiceType[] => {
  let updatedServices = selectedServices.filter((s) => s !== service);

  updatedServices = updatedServices.filter((s) =>
    isServiceAllowed(updatedServices, s)
  );

  return updatedServices;
};

const getYearPrices = (selectedYear: ServiceYear) => {
  const yearPrices = serviceData.prices[selectedYear.toString()];
  if (!yearPrices) {
    throw new Error(
      `Pricing data for the year ${selectedYear} is not available.`
    );
  }
  return yearPrices;
};

const calculateBasePrice = (
  selectedServices: ServiceType[],
  yearPrices: any
): number => {
  return selectedServices.reduce((total, service) => {
    const extraService = serviceData.extraServices.find(
      (p) => p.service === service
    );
    if (
      !extraService ||
      extraService.requires.some((required) =>
        selectedServices.includes(required)
      )
    ) {
      return total + yearPrices.individualServices[service];
    }
    return total;
  }, 0);
};

const getBestBundlePrice = (
  selectedServices: ServiceType[],
  yearBundles: any
): number => {
  let bestPrice = 0;

  yearBundles.forEach((bundle) => {
    const bundleExists =
      bundle.services.every((service) => selectedServices.includes(service)) &&
      selectedServices.every((service) => bundle.services.includes(service));

    if (bundleExists) {
      bestPrice =
        bestPrice === 0 ? bundle.cost : Math.min(bestPrice, bundle.cost);
    }
  });

  return bestPrice;
};

const hasMainService = (selectedServices: ServiceType[]): boolean => {
  return serviceData.mainServices.some((mainService) =>
    selectedServices.includes(mainService)
  );
};
