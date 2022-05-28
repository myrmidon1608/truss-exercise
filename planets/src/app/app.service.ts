import { Injectable } from "@angular/core";
import { Planet } from "./app.domain";
import { AppRepository } from "./app.repository";

@Injectable()
export class AppService {
    private _planets: Planet[] = [];
    private _loaded: boolean = false;
    private _error: boolean = false;

    constructor(private repo: AppRepository) {}

    get planets(): Planet[] {
        return this._planets.sort((a, b) => a.name.localeCompare(b.name));
    }

    get error(): boolean {
         return this._error;
    }

    get loaded(): boolean {
         return this._loaded;
    }

    public async loadPlanets(): Promise<void> {
        try {
            let resp = await this.repo.getResponse();
            this.getPlanets(resp.results);
            while (resp.next) {
                resp = await this.repo.getResponse(resp.next);
                this.getPlanets(resp.results);
            }
            this._loaded = true;
        } catch (error: any) {
            console.log(error.message);
            this._error = true;
        }
    }

    private getPlanets(resp: any[]): void {
        resp.forEach((it: any) => {
            let planet: Planet = new Planet();
            planet.name = it.name;
            planet.url = it.url;
            planet.climate = this.generateValueList(it.climate);
            planet.terrain = this.generateValueList(it.terrain);
            planet.population = it.population;
            planet.residents = String(it.residents.length);
            planet.surface_water = this.generateSurfaceWater(it.diameter, it.surface_water);
            this._planets.push(planet);
        });
    }

    private generateValueList(val: string): string[] {
        if (val === Planet.unknown) {
            return [val];
        }
        let splitVal: string[] = val.split(", ");
        return splitVal.map ((it: any) => it.charAt(0).toUpperCase() + it.slice(1).toLowerCase());
    }

    /* Surface area (in km2) covered by water
       - Assume that all planets are perfect spheres.
       - The radius of a sphere is half its diameter.
       - The value of surface_water from the API is a percentage, so a value of 50 means the planet is 50% covered in water.
       - Round these values to the nearest integer value.
    */
    private generateSurfaceWater(diameter: string, water: string): string {
        if (diameter === Planet.unknown || water === Planet.unknown) {
            return Planet.unknown;
        }
        let planetRadius: number = Number(diameter) / 2;
        let surfaceArea: number = 4 * Math.PI * Math.pow(planetRadius, 2);
        let surfaceWaterPercent: number = Number(water) / 100;
        return String(Math.round(surfaceArea * surfaceWaterPercent));
    };
}