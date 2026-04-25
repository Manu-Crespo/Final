export interface PydanticError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface FastAPIError {
  detail: PydanticError[] | string;
}

/**
 * Parsea los errores de FastAPI/Pydantic para que sean fáciles de mostrar en el frontend.
 * Retorna un mapa donde la llave es el nombre del campo y el valor es el mensaje de error.
 */
export const parseErrors = (error: any): Record<string, string> => {
  const responseData = error?.response?.data as FastAPIError;
  
  if (!responseData) {
    return { global: `Error de red o servidor no disponible (Status: ${error?.response?.status || 'N/A'}).` };
  }

  if (typeof responseData.detail === 'string') {
    return { global: responseData.detail };
  }

  if (Array.isArray(responseData.detail)) {
    const errors: Record<string, string> = {};
    responseData.detail.forEach((err) => {
      // El loc suele ser ["body", "field_name"] o ["query", "field_name"]
      const field = err.loc[err.loc.length - 1] as string;
      errors[field] = err.msg;
    });
    return errors;
  }

  return { global: 'Error de validación desconocido.' };
};
