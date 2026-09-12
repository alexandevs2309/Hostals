export const ROLES = {
    Admin: 'Admin',
    Manager: 'Manager',
    Receptionist: 'Receptionist',
    Housekeeping: 'Housekeeping',
    Maintenance: 'Maintenance',
    User: 'User'
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Devuelve true si la lista de roles del usuario incluye alguno de los permitidos.
// Sin `allowed` (undefined o vacío) la ruta es accesible para cualquier usuario autenticado.
export function hasAnyRole(userRoles: string[], allowed: Role[] | undefined): boolean {
    if (!allowed || allowed.length === 0) return true;
    return userRoles.some((role) => allowed.includes(role as Role));
}