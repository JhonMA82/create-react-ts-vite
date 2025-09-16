# CLAUDE.MD - React + Vite + TypeScript + Vitest 2025

## 🎯 Stack y Configuración Base

### Stack Principal
- **Framework**: React 19.1 con Vite 7.1 y TypeScript 5.8
- **Testing**: Vitest 3.2 con React Testing Library
- **Estilos**: Tailwind CSS 4.1
- **Estado**: Zustand 5.0 + TanStack Query 5.89
- **Routing**: React Router 7.9
- **HTTP**: Axios 1.12

### Comandos Frecuentes
```bash
pnpm dev          # Servidor desarrollo en http://localhost:5173
pnpm build        # Build producción en ./dist
pnpm test         # Tests en modo watch
pnpm test:ui      # UI de tests en http://localhost:51204/__vitest__/
pnpm lint         # ESLint con fix automático
pnpm format       # Prettier en src/**/*.{ts,tsx,css}
```

## 📁 Estructura del Proyecto

```
src/
├── components/      # Componentes reutilizables
├── features/        # Módulos por característica
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
├── hooks/          # Hooks personalizados globales
├── pages/          # Componentes de página (rutas)
├── services/       # Servicios y APIs
├── store/          # Estado global (Zustand)
├── types/          # Tipos TypeScript globales
└── utils/          # Funciones utilitarias
```

## 🔧 Patrones de Código Estándar

### Componente React con TypeScript
```tsx
// Siempre definir interfaces para props
interface ComponentProps {
  data: DataType;
  onAction?: (id: string) => void;
  className?: string;
}

// Usar React.FC con destructuring
export const Component: React.FC<ComponentProps> = ({
  data,
  onAction,
  className = ''
}) => {
  // Estados y hooks al inicio
  const [state, setState] = useState<StateType>(initialState);
  
  // Effects después de estados
  useEffect(() => {
    const controller = new AbortController();
    // Lógica con cleanup
    return () => controller.abort();
  }, [dependency]);
  
  // Handlers antes del return
  const handleClick = () => {
    onAction?.(data.id);
  };
  
  // JSX limpio y legible
  return (
    <div className={`base-styles ${className}`}>
      {/* Contenido */}
    </div>
  );
};
```

### Custom Hook Pattern
```tsx
// Tipado explícito del retorno
function useCustomHook<T>(param: string): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const [state, setState] = useState<State<T>>(initialState);
  
  const refetch = useCallback(() => {
    // Lógica de refetch
  }, [param]);
  
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true }));
        const response = await api.get(param, { 
          signal: controller.signal 
        });
        setState({ data: response.data, loading: false, error: null });
      } catch (error) {
        if (!controller.signal.aborted) {
          setState({ data: null, loading: false, error });
        }
      }
    };
    
    fetchData();
    return () => controller.abort();
  }, [param]);
  
  return { ...state, refetch };
}
```

### Estado Global con Zustand
```tsx
// Definir interface del store
interface StoreState {
  // Estado
  items: Item[];
  selectedId: string | null;
  
  // Actions
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  selectItem: (id: string | null) => void;
}

// Crear store con immer para mutaciones seguras
export const useStore = create<StoreState>((set) => ({
  items: [],
  selectedId: null,
  
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(i => i.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId
  })),
  
  selectItem: (id) => set({ selectedId: id }),
}));
```

## 🧪 Testing con Vitest

### Test de Componente
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

describe('Component', () => {
  const user = userEvent.setup();
  
  it('should handle user interaction', async () => {
    const mockHandler = vi.fn();
    
    render(<Component onAction={mockHandler} />);
    
    const button = screen.getByRole('button', { name: /action/i });
    await user.click(button);
    
    await waitFor(() => {
      expect(mockHandler).toHaveBeenCalledWith(
        expect.objectContaining({ /* expected data */ })
      );
    });
  });
});
```

## 🔒 Seguridad y Validación

### Sanitización de HTML
```tsx
import DOMPurify from 'dompurify';

// Siempre sanitizar HTML externo
const SafeHTML: React.FC<{ content: string }> = ({ content }) => {
  const clean = useMemo(
    () => DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['b', 'i', 'strong', 'em', 'p', 'span'],
      ALLOWED_ATTR: ['class']
    }),
    [content]
  );
  
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
};
```

### Validación con Zod
```tsx
import { z } from 'zod';

// Definir esquema
const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(2).max(50),
  age: z.number().min(18).optional()
});

// Inferir tipo desde esquema
type User = z.infer<typeof UserSchema>;

// Validar en runtime
const validateUser = (data: unknown): User => {
  return UserSchema.parse(data);
};
```

## ⚡ Optimización de Performance

### Lazy Loading de Rutas
```tsx
import { lazy, Suspense } from 'react';

// Lazy load de páginas pesadas
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Envolver en Suspense con fallback
<Route 
  path="dashboard" 
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <Dashboard />
    </Suspense>
  } 
/>
```

### Memoización Inteligente
```tsx
// Memoizar componentes costosos
const ExpensiveList = memo(({ items, filter }: Props) => {
  // Memoizar cálculos pesados
  const filtered = useMemo(
    () => items.filter(item => item.name.includes(filter)),
    [items, filter]
  );
  
  // Memoizar callbacks
  const handleClick = useCallback((id: string) => {
    console.log('Clicked:', id);
  }, []);
  
  return (
    <VirtualList 
      items={filtered}
      onItemClick={handleClick}
      height={600}
      itemHeight={50}
    />
  );
});
```

## 🌐 Variables de Entorno

```env
# .env.local (desarrollo)
VITE_API_URL=http://localhost:3001/api
VITE_APP_ENV=development
VITE_ENABLE_DEVTOOLS=true

# .env.production
VITE_API_URL=https://api.production.com
VITE_APP_ENV=production
VITE_ENABLE_DEVTOOLS=false
```

**⚠️ IMPORTANTE**: Solo variables con prefijo `VITE_` son expuestas al cliente

## ✅ Checklist de Mejores Prácticas

### SIEMPRE
- ✓ Usar TypeScript con `strict: true`
- ✓ Implementar error boundaries por feature
- ✓ Cancelar requests con AbortController
- ✓ Sanitizar todo input de usuario
- ✓ Memoizar componentes y cálculos costosos
- ✓ Implementar loading y error states
- ✓ Escribir tests para lógica crítica
- ✓ Usar semantic HTML y ARIA labels

### NUNCA
- ✗ Exponer secrets en variables VITE_
- ✗ Usar `dangerouslySetInnerHTML` sin sanitizar
- ✗ Mutar estado directamente
- ✗ Ignorar cleanup en useEffect
- ✗ Usar index como key en listas dinámicas
- ✗ Usar `any` en TypeScript
- ✗ Hacer requests sin manejo de errores
- ✗ Commitear sin ejecutar tests

## 📝 Plantilla de Componente Completo

```tsx
import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { useStore } from '@/store';
import { api } from '@/services/api';
import type { DataType } from '@/types';

// Validación de datos
const DataSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  value: z.number().positive()
});

// Props tipadas
interface ComponentProps {
  initialData?: DataType[];
  onUpdate?: (data: DataType[]) => void;
  className?: string;
}

// Componente memoizado
export const Component = memo<ComponentProps>(({
  initialData = [],
  onUpdate,
  className = ''
}) => {
  // Estado local
  const [localData, setLocalData] = useState<DataType[]>(initialData);
  
  // Estado global
  const { selectedItem, selectItem } = useStore();
  
  // Query con caché
  const { data, isLoading, error } = useQuery({
    queryKey: ['data-key'],
    queryFn: () => api.fetchData(),
    staleTime: 5 * 60 * 1000,
    retry: 3
  });
  
  // Mutation optimista
  const mutation = useMutation({
    mutationFn: api.updateData,
    onMutate: async (newData) => {
      // Optimistic update
      setLocalData(prev => [...prev, newData]);
    },
    onError: (error, newData, context) => {
      // Rollback on error
      console.error('Update failed:', error);
    }
  });
  
  // Cálculos memoizados
  const processedData = useMemo(
    () => localData.filter(item => item.active),
    [localData]
  );
  
  // Callbacks optimizados
  const handleUpdate = useCallback((item: DataType) => {
    mutation.mutate(item);
    onUpdate?.(localData);
  }, [mutation, localData, onUpdate]);
  
  // Cleanup effect
  useEffect(() => {
    const controller = new AbortController();
    
    return () => {
      controller.abort();
    };
  }, []);
  
  // Estados de UI
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} retry={() => {}} />;
  if (!data?.length) return <EmptyState />;
  
  // Render principal
  return (
    <div className={`container mx-auto p-4 ${className}`}>
      <div className="grid gap-4">
        {processedData.map(item => (
          <Card
            key={item.id}
            data={item}
            isSelected={selectedItem?.id === item.id}
            onSelect={() => selectItem(item)}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
});

Component.displayName = 'Component';
```

## 🚀 Instrucciones Específicas para Claude Code

1. **Priorizar funcionalidad** sobre estética en aplicaciones complejas
2. **TypeScript estricto** - nunca usar `any`, siempre tipar explícitamente
3. **Error boundaries** en cada módulo feature
4. **Nombres descriptivos** - el código debe ser autodocumentado
5. **Tests mínimo 80%** de cobertura en lógica de negocio
6. **Performance first** - lazy loading, virtualización, memoización
7. **Seguridad by default** - sanitización, validación, CSP headers
8. **Estado mínimo** - preferir derived state cuando sea posible
9. **Componentes pequeños** - máximo 150 líneas por componente
10. **Imports organizados** - React, librerías externas, imports locales

---

*Stack optimizado para desarrollo React moderno - 2025*
*Actualizar según evolucionen las dependencias del proyecto*