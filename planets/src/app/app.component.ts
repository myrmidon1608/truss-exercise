import { Component } from '@angular/core';
import { Planet } from './app.domain';
import { AppService } from './app.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    constructor(private service: AppService) {
        this.service.loadPlanets();
    }

    get planets(): Planet[] {
        return this.service.planets;
    }

    get loaded(): boolean {
        return this.service.loaded || this.error;
    }

    get error(): boolean {
        return this.service.error;
    }

    public formatDisplay(val: string): string {
        return val === Planet.unknown ? "?" : val;
    }

    public formatNumber(val: string): string {
        if (val === Planet.unknown) {
            return "?";
        }

        if (val.length <= 3) {
            return val;
        }

        let places: string[] = val.split( /(?=(?:...)*$)/ );
        return places ? places.join(" ") : val;
    }
}
