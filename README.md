# 🚀 Dev Utils - Plantillas de GitHub Workflows

Este repositorio contiene plantillas de GitHub Actions workflows para proyectos frontend y backend separados.

## 📁 Estructura

### Workflows por Carpeta

**Frontend (`workflow-front/`):**
- **`pr-setup.yml`** - Configuración y variables de entorno
- **`pr-quality.yml`** - Type checking, linting, formato
- **`pr-tests.yml`** - Tests unitarios con coverage
- **`pr-security.yml`** - Escaneo de seguridad (Semgrep, Snyk, npm audit)
- **`pr-validation.yml`** - Validación de etiquetas y título

**Backend (`workflow-back/`):**
- **`pr-setup.yml`** - Configuración y variables de entorno (con base de datos opcional)
- **`pr-tests.yml`** - Tests unitarios + integración con coverage
- **`pr-security.yml`** - Escaneo de seguridad + validación específica (CORS, secrets, helmet)
- **`pr-validation.yml`** - Validación de etiquetas específicas del backend

**Utilitarios:**
- **`branch-protection.yml`** - Bloquea push directo a main/develop (requiere PR)
- **`build-release.yml`** - Build y releases (para backend)

## Cómo Usar

### Para Proyecto Frontend

1. Copia los workflows de `workflow-front/` a tu proyecto:
   ```bash
   # En tu proyecto frontend
   mkdir -p .github/workflows
   cp workflow-front/*.yml .github/workflows/
   cp branch-protection.yml .github/workflows/  # protección de ramas
   ```

2. Configura variables opcionales en GitHub (Settings → Variables):
   - `UPLOAD_COVERAGE` = `true` (para Codecov) o `false` (default)

3. Configura secrets en GitHub:
   - `API_URL` - URL de tu API backend
   - `SEMGREP_APP_TOKEN` - Token para Semgrep (opcional)
   - `SNYK_TOKEN` - Token para Snyk (opcional)

4. Ajusta los scripts en tu `package.json`:
   ```json
   {
     "scripts": {
       "type-check": "tsc --noEmit",
       "lint": "eslint src --ext .ts,.tsx",
       "format:check": "prettier --check src",
       "test:unit": "vitest",
       "build": "vite build"
     }
   }
   ```

5. Configura coverage en tu archivo de configuración de tests:
   ```javascript
   // vitest.config.js
   export default {
     test: {
       coverage: {
         reporter: ['text', 'json', 'html'],
         lines: 80,
         functions: 80,
         branches: 80,
         statements: 80
       }
     }
   }
   ```

### Para Proyecto Backend

1. Copia los workflows de `workflow-back/` a tu proyecto:
   ```bash
   # En tu proyecto backend
   mkdir -p .github/workflows
   cp workflow-back/*.yml .github/workflows/
   cp branch-protection.yml .github/workflows/  # protección de ramas
   cp build-release.yml .github/workflows/  # opcional
   ```

2. Configura variables opcionales en GitHub (Settings → Variables):
   - `USE_DATABASE` = `true` (para PostgreSQL + Redis) o `false` (default)
   - `UPLOAD_COVERAGE` = `true` (para Codecov) o `false` (default)

3. Si usas base de datos (`USE_DATABASE=true`), descomenta los servicios Docker en `pr-setup.yml`

4. Configura secrets en GitHub:
   - `JWT_SECRET` - Secret para JWT
   - `SEMGREP_APP_TOKEN` - Token para Semgrep (opcional)
   - `SNYK_TOKEN` - Token para Snyk (opcional)

5. Ajusta los scripts en tu `package.json`:
   ```json
   {
     "scripts": {
       "type-check": "tsc --noEmit",
       "lint": "eslint src --ext .ts",
       "format:check": "prettier --check src",
       "test:unit": "jest",
       "test:integration": "jest --config jest.integration.config.js",
       "build": "tsc"
     }
   }
   ```

6. Configura coverage en Jest:
   ```javascript
   // jest.config.js
   module.exports = {
     collectCoverage: true,
     coverageDirectory: 'coverage',
     coverageReporters: ['text', 'lcov', 'html'],
     coverageThreshold: {
       global: {
         branches: 80,
         functions: 80,
         lines: 80,
         statements: 80
       }
     }
   }
   ```

## 🔄 Flujo de PRs

### Ventajas de la Estructura Separada

**Independencia:** Cada workflow corre por separado
- Si un job falla, los otros continúan
- Mayor visibilidad de qué falló específicamente
- Paralelismo máximo para velocidad

**Frontend:**
```
PR → [setup] || [quality] || [tests] || [security] || [validation]
```

**Backend:**
```
PR → [setup] || [tests] || [security] || [validation]
```

## 🛡️ Seguridad

Todos los workflows están diseñados para evitar inyecciones de shell:

- ✅ Usan variables de entorno intermedias
- ✅ Sin contexto GitHub directo en comandos `run:`
- ✅ Variables sensibles en `secrets.*`

## 📋 Características por Workflow

### Frontend
- ✅ Type checking, linting, formato
- ✅ Tests unitarios con coverage 80% mínimo
- ✅ Escaneo Semgrep para React/TypeScript
- ✅ Validación de etiquetas estándar
- ✅ Reportes automáticos en PRs

### Backend
- ✅ Type checking, linting, formato
- ✅ Tests unitarios + integración con coverage 80% mínimo
- ✅ Soporte opcional para PostgreSQL + Redis
- ✅ Escaneo Semgrep para Node.js/Express
- ✅ Validación de seguridad específica (CORS, secrets, helmet)
- ✅ Validación de etiquetas específicas (api, database, security, performance)
- ✅ Validación especial para cambios en base de datos
- ✅ Reportes automáticos en PRs

## 📋 Requisitos

### Frontend
- Node.js 20+
- npm o pnpm
- TypeScript
- Vite (o similar)

### Backend
- Node.js 20+
- npm o pnpm
- TypeScript
- PostgreSQL + Redis (opcional, para tests)

## 🏷️ Etiquetas Requeridas

### Frontend
- `feature`, `fix`, `hotfix`, `docs`, `style`, `refactor`, `test`, `chore`

### Backend
- Todas las de frontend + `api`, `database`, `security`, `performance`

## 🚨 Notas Importantes

- **Independencia:** Los workflows corren por separado, si uno falla los demás continúan
- **Paralelismo:** Máxima velocidad con ejecución simultánea
- **Coverage mínimo requerido:** 80%
- **Todo es configurable** según tus necesidades
- **Sin duplicación:** Cada workflow contiene solo lo relevante para su tipo

## 🤝 Contribuir

Si quieres agregar más plantillas o mejorar las existentes, siéntete libre de hacer un PR.