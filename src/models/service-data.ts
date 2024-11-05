import { ServiceType } from "./service-type";
import { ServiceYear } from "./service-year";
import { YearPrices } from "./year-prices";

export interface ServiceData {
    mainServices: ServiceType[];
    extraServices: ExtraService[];
    prices: {
        [year in ServiceYear]: YearPrices;
    };
}

export interface ExtraService{
    service: ServiceType,
    requires: ServiceType[]
}