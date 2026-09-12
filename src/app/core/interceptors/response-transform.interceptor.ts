import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Convierte una clave a camelCase sin tocar las que ya lo están:
//   snake_case → camelCase (total_rooms → totalRooms)
//   PascalCase  → camelCase (TotalRooms → totalRooms)
//   camelCase   → se mantiene (refreshToken → refreshToken)
function toCamelKey(key: string): string {
    if (key.includes('_')) {
        return key.replace(/_+([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase());
    }
    return key.charAt(0).toLowerCase() + key.slice(1);
}

function transformKeys(obj: unknown): unknown {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(transformKeys);
    }

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        const camelKey = toCamelKey(key);
        result[camelKey] = transformKeys(value);
    }
    return result;
}

export const responseTransformInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        map((event) => {
            if (event instanceof HttpResponse && event.body) {
                const transformed = transformKeys(event.body);
                return event.clone({ body: transformed });
            }
            return event;
        })
    );
};