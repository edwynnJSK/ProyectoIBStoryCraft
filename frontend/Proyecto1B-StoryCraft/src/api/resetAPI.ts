// src/api/resetAPI.ts

export interface ResetPasswordPayload {
  UserID: number;
  Password: string;
}

export const resetPassword = async (payload: ResetPasswordPayload): Promise<void> => {
  const response = await fetch(`http://localhost:3001/api/users/${payload.UserID}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: payload.Password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar la contraseña');
  }

  const data = await response.json();
  return data.message || 'Contraseña actualizada con éxito';
};
  

