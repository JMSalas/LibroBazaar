export class ErrorValidacion extends Error {
    constructor(mensaje, detalles = []) {
        super(mensaje);
        this.name = 'BAD_REQUEST';
        this.statusCode = 400;
        this.detalles = detalles; // Array de errores específicos
    }
}

export class ErrorRegistro extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.name = 'DUPLICATE_ENTRY';
        this.statusCode = 409;
    }
}

export class ErrorAutenticacion extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.name = 'UNAUTHORIZED';
        this.statusCode = 401;
    }
}

export class ErrorRecursoNoEncontrado extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.name = 'NOT_FOUND_ERROR';
        this.statusCode = 404;
    }
}

export class ErrorServidor extends Error {
    constructor(mensaje) {
        super(mensaje);
        this.name = 'SERVER_ERROR';
        this.statusCode = 500;
    }
}