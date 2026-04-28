import { Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { AuthLayoutComponent } from './auth/auth-layout/auth-layout.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { LockScreenComponent } from './auth/lock-screen/lock-screen.component';
import { ConfirmEmailComponent } from './auth/confirm-email/confirm-email.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { ComingSoonPageComponent } from './common/coming-soon-page/coming-soon-page.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/inicio/inicio.component').then((m) => m.InicioComponent),
    },
    {
        path: 'clientes',
        loadComponent: () =>
            import('./features/clientes/clientes.component').then((m) => m.ClientesComponent),
    },
    {
        path: 'clientes/cliente/:id',
        loadComponent: () =>
            import('./features/clientes/cliente-ficha.component').then((m) => m.ClienteFichaComponent),
    },
    {
        path: 'reunificacion',
        loadComponent: () =>
            import('./features/reunificacion/reunificacion-inicio/reunificacion-inicio.component').then(
                (m) => m.ReunificacionInicioComponent,
            ),
    },
    {
        path: 'reunificacion/procesos',
        loadComponent: () =>
            import(
                './features/reunificacion/procesos-reunificacion-page/procesos-reunificacion-page.component'
            ).then((m) => m.ProcesosReunificacionPageComponent),
    },
    {
        path: 'reunificacion/morosos',
        loadComponent: () =>
            import(
                './features/reunificacion/morosos-reunificacion-page/morosos-reunificacion-page.component'
            ).then((m) => m.MorososReunificacionPageComponent),
    },
    {
        path: 'reunificacion/seguimiento',
        loadComponent: () =>
            import(
                './features/reunificacion/seguimiento-reunificacion-page/seguimiento-reunificacion-page.component'
            ).then((m) => m.SeguimientoReunificacionPageComponent),
    },
    {
        path: 'reunificacion/solicitudes-pago',
        loadComponent: () =>
            import(
                './features/reunificacion/solicitudes-pago-reunificacion-page/solicitudes-pago-reunificacion-page.component'
            ).then((m) => m.SolicitudesPagoReunificacionPageComponent),
    },
    {
        path: 'perfil',
        loadComponent: () =>
            import('./features/agente/agente.component').then((m) => m.AgenteComponent),
    },
    {
        path: 'ficha-laboral',
        loadComponent: () =>
            import('./features/usuario-seccion/usuario-seccion.component').then(
                (m) => m.UsuarioSeccionComponent,
            ),
        data: { pageTitle: 'Ficha laboral' },
    },
    {
        path: 'academia',
        loadComponent: () =>
            import('./features/usuario-seccion/usuario-seccion.component').then(
                (m) => m.UsuarioSeccionComponent,
            ),
        data: { pageTitle: 'Academia' },
    },
    {
        path: 'buzon',
        loadComponent: () =>
            import('./features/usuario-seccion/usuario-seccion.component').then(
                (m) => m.UsuarioSeccionComponent,
            ),
        data: { pageTitle: 'Buzón' },
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            { path: '', component: LoginComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'reset-password', component: ResetPasswordComponent },
            { path: 'lock-screen', component: LockScreenComponent },
            { path: 'confirm-email', component: ConfirmEmailComponent },
            { path: 'logout', component: LogoutComponent },
        ],
    },
    {
        path: 'authentication',
        redirectTo: 'auth',
        pathMatch: 'prefix',
    },
    { path: 'coming-soon', component: ComingSoonPageComponent },
    { path: 'blank-page', component: BlankPageComponent },
    { path: 'internal-error', component: InternalErrorComponent },
    { path: '**', component: NotFoundComponent },
];
