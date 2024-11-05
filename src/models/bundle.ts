import { ServiceType } from "./service-type";

export interface Bundle {
    services: ServiceType[];
    cost: number;
}