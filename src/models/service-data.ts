import { ServiceType } from "./service-type";
import { ServiceYear } from "./service-year";
import { YearPrices } from "./year-prices";

export interface ServiceData {
    mainServices: ServiceType[];
    extraServices: ServiceType[];
    prices: {
        [year in ServiceYear]: YearPrices;
    };
}