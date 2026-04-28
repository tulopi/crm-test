import { Injectable } from '@angular/core';
import { Observable, delay, map, of, throwError } from 'rxjs';
import {
    CLIENTES_DETALLE_MOCK,
    CLIENTES_MOCK,
    CUENTAS_NEGOCIACION_MOCK,
    EXPEDIENTES_MOCK,
} from './clientes.data';
import {
    ClienteDetalle,
    CuentaDeuda,
    CuentaMovimiento,
    CuentaNegociacion,
    CuentaNegociacionInfo,
    CuotaPlanPago,
    ExpedienteCliente,
    ProcesoReunificacion,
    REUNIFICACION_PRODUCTO_ID,
} from './clientes.model';

export interface ClienteFichaSnapshot {
    cliente: ClienteDetalle | null;
    expedientes: ExpedienteCliente[];
    expedientesReunificacion: ExpedienteCliente[];
    expedienteSeleccionado: ExpedienteCliente | null;
    cuentaNegociacion: CuentaNegociacion | null;
}

export interface PlanPagoDraft {
    deudaTotal: number;
    honorarios: number;
    mesesPlan: number;
    ingresosNetos: number;
    gastosFijos: number;
}

@Injectable({ providedIn: 'root' })
export class ClientesRepository {
    private clientes = structuredClone(CLIENTES_DETALLE_MOCK);
    private expedientes = structuredClone(EXPEDIENTES_MOCK);
    private cuentas = structuredClone(CUENTAS_NEGOCIACION_MOCK);

    getClienteFichaById(clienteId: string): Observable<ClienteFichaSnapshot> {
        return of(null).pipe(
            delay(300),
            map(() => {
                const cliente = this.clientes.find((c) => c.id === clienteId) ?? null;
                if (!cliente) {
                    return {
                        cliente: null,
                        expedientes: [],
                        expedientesReunificacion: [],
                        expedienteSeleccionado: null,
                        cuentaNegociacion: null,
                    };
                }

                const expedientes = this.expedientes
                    .filter((exp) => exp.clienteId === clienteId)
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

                const expedientesReunificacion = expedientes.filter(
                    (exp) => exp.producto === REUNIFICACION_PRODUCTO_ID,
                );

                // Estrategia explícita para cliente/:id:
                // 1) si hay expediente de reunificación abierto, se elige ese;
                // 2) si no, el más reciente de reunificación;
                // 3) si no hay ninguno, no se muestra cuenta de negociación.
                const expedienteSeleccionado =
                    expedientesReunificacion.find((exp) => exp.estado === 'abierto') ??
                    expedientesReunificacion[0] ??
                    null;

                const cuentaNegociacion = expedienteSeleccionado
                    ? this.cuentas.find((c) => c.expedienteId === expedienteSeleccionado._id) ?? null
                    : null;

                return {
                    cliente,
                    expedientes,
                    expedientesReunificacion,
                    expedienteSeleccionado,
                    cuentaNegociacion,
                };
            }),
        );
    }

    getClienteList(): Observable<ClienteDetalle[]> {
        return of(this.clientes.map((cliente) => ({ ...cliente }))).pipe(delay(100));
    }

    getClientesCatalogo() {
        return CLIENTES_MOCK;
    }

    seleccionarExpediente(clienteId: string, expedienteId: string): Observable<ClienteFichaSnapshot> {
        return this.getClienteFichaById(clienteId).pipe(
            map((snapshot) => {
                const expedienteSeleccionado =
                    snapshot.expedientesReunificacion.find((exp) => exp._id === expedienteId) ?? null;
                const cuentaNegociacion = expedienteSeleccionado
                    ? this.cuentas.find((c) => c.expedienteId === expedienteSeleccionado._id) ?? null
                    : null;
                return {
                    ...snapshot,
                    expedienteSeleccionado,
                    cuentaNegociacion,
                };
            }),
        );
    }

    abrirPlanDePagos(cuentaId: string, draft: PlanPagoDraft): Observable<CuentaNegociacion> {
        const cuenta = this.cuentas.find((c) => c._id === cuentaId);
        if (!cuenta) {
            return throwError(() => new Error('Cuenta de negociación no encontrada.'));
        }

        const deudaFinal = Math.max(draft.deudaTotal + draft.honorarios, 0);
        const pagoMensual = draft.mesesPlan > 0 ? Number((deudaFinal / draft.mesesPlan).toFixed(2)) : 0;
        const fechaInicio = new Date();
        const fechaFin = new Date(fechaInicio);
        fechaFin.setMonth(fechaFin.getMonth() + draft.mesesPlan);
        const cuotas = Array.from({ length: draft.mesesPlan }).map((_, index) => {
            const fechaPrevista = new Date(fechaInicio);
            fechaPrevista.setMonth(fechaPrevista.getMonth() + index + 1);
            return {
                _id: `cuo-${cuentaId}-${index + 1}`,
                numeroCuota: index + 1,
                fechaPrevista,
                estado: 'pendiente' as const,
                monto: pagoMensual,
            };
        });

        const updated: CuentaNegociacion = {
            ...cuenta,
            planDePago: {
                abierto: true,
                mesesPlan: draft.mesesPlan,
                mesesTotales: draft.mesesPlan,
                pagoMensual,
                deudaFinal,
                honorariosTotales: draft.honorarios,
            },
            cuotas,
            infoCuenta: {
                ...cuenta.infoCuenta,
                saldo: deudaFinal,
                cuota: pagoMensual,
                fechaInicio,
                fechaFin,
                ingresosNetos: draft.ingresosNetos,
                ingresosBrutos: draft.ingresosNetos + draft.gastosFijos,
                objetivoAhorro: Math.max(draft.ingresosNetos - draft.gastosFijos - pagoMensual, 0),
            },
            historialAcciones: [...cuenta.historialAcciones, 'Plan de pagos generado'],
        };
        this.replaceCuenta(updated);
        return of(structuredClone(updated)).pipe(delay(250));
    }

    actualizarInfoCuenta(cuentaId: string, patch: Partial<CuentaNegociacionInfo>): Observable<CuentaNegociacion> {
        const cuenta = this.cuentas.find((c) => c._id === cuentaId);
        if (!cuenta) {
            return throwError(() => new Error('Cuenta de negociación no encontrada.'));
        }
        const updated = {
            ...cuenta,
            infoCuenta: { ...cuenta.infoCuenta, ...patch },
            historialAcciones: [...cuenta.historialAcciones, 'Datos de cuenta actualizados'],
        };
        this.replaceCuenta(updated);
        return of(structuredClone(updated)).pipe(delay(220));
    }

    crearDeuda(cuentaId: string, draft: Omit<CuentaDeuda, '_id' | 'estado'>): Observable<CuentaNegociacion> {
        const cuenta = this.cuentas.find((c) => c._id === cuentaId);
        if (!cuenta) {
            return throwError(() => new Error('Cuenta de negociación no encontrada.'));
        }
        const nuevaDeuda: CuentaDeuda = {
            _id: `deu-${Date.now()}`,
            estado: 'pendiente',
            ...draft,
        };
        const updatedSaldo = cuenta.infoCuenta.saldo + nuevaDeuda.deudaTotal;
        const updated = {
            ...cuenta,
            deudas: [nuevaDeuda, ...cuenta.deudas],
            infoCuenta: {
                ...cuenta.infoCuenta,
                saldo: updatedSaldo,
            },
            movimientos: [
                {
                    _id: `mov-${Date.now()}`,
                    fecha: new Date(),
                    tipo: 'deuda' as const,
                    monto: nuevaDeuda.deudaTotal,
                    comentario: `Alta deuda: ${nuevaDeuda.acreedor}`,
                },
                ...cuenta.movimientos,
            ],
        };
        this.replaceCuenta(updated);
        return of(structuredClone(updated)).pipe(delay(220));
    }

    pagarDeuda(cuentaId: string, deudaId: string): Observable<CuentaNegociacion> {
        const cuenta = this.cuentas.find((c) => c._id === cuentaId);
        if (!cuenta) {
            return throwError(() => new Error('Cuenta de negociación no encontrada.'));
        }
        const deuda = cuenta.deudas.find((item) => item._id === deudaId);
        if (!deuda) {
            return throwError(() => new Error('Deuda no encontrada.'));
        }
        const deudas = cuenta.deudas.map((item) =>
            item._id === deudaId ? { ...item, estado: 'pagada' as const } : item,
        );
        const saldo = Number((cuenta.infoCuenta.saldo - deuda.deudaTotal).toFixed(2));
        const updated = {
            ...cuenta,
            deudas,
            infoCuenta: { ...cuenta.infoCuenta, saldo },
            movimientos: [
                {
                    _id: `mov-${Date.now()}`,
                    fecha: new Date(),
                    tipo: 'ingreso' as const,
                    monto: deuda.deudaTotal,
                    comentario: `Pago deuda ${deuda.acreedor}`,
                },
                ...cuenta.movimientos,
            ],
        };
        this.replaceCuenta(updated);
        return of(structuredClone(updated)).pipe(delay(220));
    }

    pagarCuota(cuentaId: string, cuotaId: string): Observable<CuentaNegociacion> {
        const cuenta = this.cuentas.find((c) => c._id === cuentaId);
        if (!cuenta) {
            return throwError(() => new Error('Cuenta de negociación no encontrada.'));
        }
        const cuota = cuenta.cuotas.find((item) => item._id === cuotaId);
        if (!cuota || cuota.estado === 'pagada') {
            return of(structuredClone(cuenta)).pipe(delay(100));
        }

        const cuotas: CuotaPlanPago[] = cuenta.cuotas.map((item) =>
            item._id === cuotaId
                ? {
                      ...item,
                      estado: 'pagada',
                      fechaPago: new Date(),
                  }
                : item,
        );
        const saldo = Number((cuenta.infoCuenta.saldo - cuota.monto).toFixed(2));
        const updated = {
            ...cuenta,
            cuotas,
            infoCuenta: {
                ...cuenta.infoCuenta,
                saldo,
                fechaUltimoPago: new Date(),
            },
            movimientos: [
                {
                    _id: `mov-${Date.now()}`,
                    fecha: new Date(),
                    tipo: 'ingreso' as const,
                    monto: cuota.monto,
                    comentario: `Pago cuota ${cuota.numeroCuota}`,
                },
                ...cuenta.movimientos,
            ],
        };
        this.replaceCuenta(updated);
        return of(structuredClone(updated)).pipe(delay(220));
    }

    registrarDevolucion(cuentaId: string, monto: number, comentario: string): Observable<CuentaNegociacion> {
        const cuenta = this.cuentas.find((c) => c._id === cuentaId);
        if (!cuenta) {
            return throwError(() => new Error('Cuenta de negociación no encontrada.'));
        }
        const saldo = Number((cuenta.infoCuenta.saldo + Math.abs(monto)).toFixed(2));
        const updated = {
            ...cuenta,
            infoCuenta: { ...cuenta.infoCuenta, saldo },
            movimientos: [
                {
                    _id: `mov-${Date.now()}`,
                    fecha: new Date(),
                    tipo: 'devolucion' as const,
                    monto: Math.abs(monto),
                    comentario,
                },
                ...cuenta.movimientos,
            ],
        };
        this.replaceCuenta(updated);
        return of(structuredClone(updated)).pipe(delay(220));
    }

    actualizarProceso(
        cuentaId: string,
        procesoReunificacion: ProcesoReunificacion,
    ): Observable<CuentaNegociacion> {
        const cuenta = this.cuentas.find((c) => c._id === cuentaId);
        if (!cuenta) {
            return throwError(() => new Error('Cuenta de negociación no encontrada.'));
        }
        const updated = {
            ...cuenta,
            procesoReunificacion: { ...procesoReunificacion },
            historialAcciones: [...cuenta.historialAcciones, 'Proceso de reunificación actualizado'],
        };
        this.replaceCuenta(updated);
        return of(structuredClone(updated)).pipe(delay(220));
    }

    private replaceCuenta(next: CuentaNegociacion): void {
        const index = this.cuentas.findIndex((c) => c._id === next._id);
        if (index === -1) {
            this.cuentas = [next, ...this.cuentas];
            return;
        }
        this.cuentas[index] = next;
    }
}
