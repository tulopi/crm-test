import { Component, signal } from '@angular/core';
import { ToggleService } from './common/sidebar/toggle.service';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { CommonModule, NgClass, ViewportScroller } from '@angular/common';
import { RouterOutlet, Router, Event, NavigationEnd } from '@angular/router';
import { CustomizerSettingsService } from './customizer-settings/customizer-settings.service';
import { CustomizerSettingsComponent } from './customizer-settings/customizer-settings.component';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent, FooterComponent, CustomizerSettingsComponent, NgClass],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

    protected readonly title = signal('TRAMICRM - Angular 20 Material Design Admin Dashboard Template');

    // isSidebarToggled
    isSidebarToggled = false;

    private previousUrl: string | null = null;

    /** Rutas sin shell lateral (login, plantillas de error, etc.). */
    isBlankShellRoute(): boolean {
        const path = this.router.url.split('?')[0].split('#')[0];
        if (path === '/coming-soon') {
            return true;
        }
        return path === '/auth' || path.startsWith('/auth/');
    }

    constructor(
        public router: Router,
        private toggleService: ToggleService,
        private viewportScroller: ViewportScroller,
        public themeService: CustomizerSettingsService
    ) {
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                const currentUrl = event.urlAfterRedirects;
                // Scroll to top ONLY if navigating to a different route (not on refresh)
                if (this.previousUrl && this.previousUrl !== currentUrl) {
                    this.viewportScroller.scrollToPosition([0, 0]);
                }
                this.previousUrl = currentUrl;
            }
        });
        this.toggleService.isSidebarToggled$.subscribe(isSidebarToggled => {
            this.isSidebarToggled = isSidebarToggled;
        });
    }

}