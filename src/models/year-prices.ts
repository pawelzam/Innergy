
import { Bundle } from "./bundle";
import { IndividualServicePrices } from "./individual-service-prices";

export interface YearPrices {
    individualServices: IndividualServicePrices;
    bundles: Bundle[];
}