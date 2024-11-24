export interface LoginRequest {
    Email: string;
    Password: string;
  }
  
  export interface LoginResponse {
    UserID: number;
    Username: string;
  }
  
  export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch('http://localhost:3001/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('Invalid email or password');
    }
  
    const responseData: LoginResponse = await response.json();
    return responseData;
  };