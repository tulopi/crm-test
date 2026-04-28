export interface ClienteListado {
    id: string;
    nombre: string;
    apellido: string;
    documento: string;
    movil: string;
    email: string;
    creacion: Date;
}

export const REUNIFICACION_PRODUCTO_ID = '680a36740d35d0585942df35';

export interface ClienteDetalle extends ClienteListado {
    nombrePreferido?: string;
    telefonoSecundario?: string;
    horarioAtencionInicio?: string;
    horarioAtencionFin?: string;
    civilStatus?: string;
    gender?: string;
    birthdate?: Date;
    address?: {
        calle?: string;
        ciudad?: string;
        provincia?: string;
        codigoPostal?: string;
    };
}

export interface DocumentoCliente {
    _id: string;
    nombre: string;
    tipo: string;
    createdAt: Date;
}

export interface ExpedienteCliente {
    _id: string;
    clienteId: string;
    producto: string;
    productoNombre: string;
    estado: 'abierto' | 'en_proceso' | 'cerrado';
    createdAt: Date;
    agenteId: string;
    documentos: DocumentoCliente[];
}

export interface CuentaDeuda {
    _id: string;
    acreedor: string;
    estado: 'pendiente' | 'negociacion' | 'pagada';
    deudaTotal: number;
    pagoAcordado?: number;
    judicializado?: boolean;
}

export interface CuentaMovimiento {
    _id: string;
    fecha: Date;
    tipo: 'ingreso' | 'deuda' | 'ajuste' | 'devolucion';
    monto: number;
    comentario: string;
}

export interface CuotaPlanPago {
    _id: string;
    numeroCuota: number;
    fechaPrevista: Date;
    estado: 'pendiente' | 'pagada';
    monto: number;
    fechaPago?: Date;
}

export interface ProcesoReunificacion {
    envioEmailDocumentacion?: boolean;
    contratoFirmado?: boolean;
    negociacion?: boolean;
    judicializado?: boolean;
    comentario?: string;
}

export interface CuentaNegociacionInfo {
    saldo: number;
    fechaInicio?: Date;
    cuota: number;
    fechaFin?: Date;
    fechaUltimoPago?: Date;
    motivo: string;
    bienesMuebles: boolean;
    bienesInmuebles: boolean;
    ingresosBrutos: number;
    ingresosNetos: number;
    objetivoAhorro: number;
}

export interface CuentaNegociacion {
    _id: string;
    clienteId: string;
    expedienteId: string;
    planDePago: {
        abierto: boolean;
        mesesPlan: number;
        mesesTotales: number;
        pagoMensual: number;
        deudaFinal: number;
        honorariosTotales: number;
    };
    infoCuenta: CuentaNegociacionInfo;
    deudas: CuentaDeuda[];
    movimientos: CuentaMovimiento[];
    cuotas: CuotaPlanPago[];
    historialAcciones: string[];
    procesoReunificacion: ProcesoReunificacion;
}
