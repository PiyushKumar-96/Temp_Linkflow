# Feature Colocation Architecture Convention

This directory follows a strict modular colocation pattern for all LinkedFlow screens.

## Structure

```text
src/app/<route-name>/
├── page.jsx            # The single route entry. Owns queries/state, passes plain data down.
├── _components/        # Private components used ONLY by this route.
├── _api/               # TanStack Query & Mutation hooks for this route.
└── _model/             # Pure domain derivations, local constants, and formatters.
```

## The Boundary Rules

1. **`_` prefix means private**: Anything inside `_components/`, `_api/`, or `_model/` belongs strictly to this route. Never cross-import private folders from other routes.
2. **Promote on second use**: If a component or helper is genuinely needed by a second route, promote it to `src/components/` or `src/lib/`.
3. **One-way dependency direction**:
   - `src/app/<route>/` → `src/components/` → `src/lib/`
   - Shared components and libraries **never** import from `src/app/`.
4. **`page.jsx` fetches; children take props**: Data fetching is initiated at the route boundary (`page.jsx`). Components in `_components/` are presentational, predictable, and easily testable.
5. **Clean alias imports**: Never use deeply nested `../../..`. Use the `@/` path alias for any module outside the local route folder.
