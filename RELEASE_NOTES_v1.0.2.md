# Release Notes v1.0.2

## 🐛 Critical Bug Fix: React Bundling Issue

### Problem
Package was bundling its own copy of React, causing "Invalid hook call" errors in applications like Laravel Inertia, Next.js, and other React apps.

**Error Message:**
```
Warning: Invalid hook call. Hooks can only be called inside of the body of a function component.
This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
```

### Solution
- ✅ Removed React from `dependencies` in package.json (kept only in `peerDependencies`)
- ✅ Added `react/jsx-runtime` and `react/jsx-dev-runtime` to tsup external config
- ✅ Package now properly shares React instance with host application
- ✅ Bundle size reduced (React no longer included)

### Changes Made

#### 1. package.json
```diff
  "dependencies": {
    "@radix-ui/react-checkbox": "^1.3.1",
    ...
-   "react": ">=17.0.0",
    "react-day-picker": "^8.10.1",
    ...
  }
```

#### 2. tsup.config.ts
```diff
  external: [
    'react',
    'react-dom',
+   'react/jsx-runtime',
+   'react/jsx-dev-runtime',
  ],
```

### Testing Instructions

#### For Laravel Inertia Users:
1. Update package:
   ```bash
   npm install @madulinux/react-datatable@1.0.2
   ```

2. Clear build cache:
   ```bash
   npm run build
   php artisan view:clear
   ```

3. Test your DataTable component - error should be gone!

#### For Other React Apps:
1. Update package:
   ```bash
   npm install @madulinux/react-datatable@1.0.2
   ```

2. Clear cache (if using bundler):
   ```bash
   # Vite
   rm -rf node_modules/.vite
   
   # Next.js
   rm -rf .next
   
   # Create React App
   rm -rf node_modules/.cache
   ```

3. Restart dev server

### Verification

You can verify React is not bundled by checking:
```bash
# Should show "require("react")" not bundled React code
grep "require(\"react\")" node_modules/@madulinux/react-datatable/dist/index.js
```

### Breaking Changes
None - this is a pure bug fix release.

### Requirements
- React >= 17.0.0
- react-dom >= 17.0.0

Both should already be installed in your project.

---

**Published:** 2024-11-02  
**Author:** madulinux
