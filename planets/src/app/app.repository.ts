import { Injectable } from "@angular/core";
import {HttpClient} from '@angular/common/http';
import { firstValueFrom } from "rxjs";

@Injectable()
export class AppRepository {
    private static apiUrl: string = "https://swapi.dev/api/planets/";

    /**
    {
        "climate": "Arid",
        "diameter": "10465", // in km
        "gravity": "1 standard",
        "name": "Tatooine",
        "orbital_period": "304",
        "population": "200000",
        "residents": [
            "https://swapi.dev/api/people/1/",
            "https://swapi.dev/api/people/2/",
            ...
        ],
        "rotation_period": "23",
        "surface_water": "1", // in %
        "terrain": "Dessert",
        "url": "https://swapi.dev/api/planets/1/"
    }
    */

    constructor(private http: HttpClient) {}

    public async getResponse(url: string = AppRepository.apiUrl): Promise<any> {
        return await firstValueFrom(this.http.get(url));
    }
}