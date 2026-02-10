export const getAuthToken = (): string | null => {
    return localStorage.getItem('ofm_token');
};

export const setAuthToken = (token: string): void => {
    localStorage.setItem('ofm_token', token);
};

export const removeAuthToken = (): void => {
    localStorage.removeItem('ofm_token');
};

export const getUser = (): any | null => {
    const user = localStorage.getItem('ofm_user');
    return user ? JSON.parse(user) : null;
};

export const setUser = (user: any): void => {
    localStorage.setItem('ofm_user', JSON.stringify(user));
};

export const removeUser = (): void => {
    localStorage.removeItem('ofm_user');
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

export const logout = (): void => {
    removeAuthToken();
    removeUser();
};
