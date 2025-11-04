# Release Notes v1.0.3 (Complete Fix)

## 🐛 Critical Bug Fix: React Bundling from Radix UI

### Update from v1.0.2
Version 1.0.2 fixed React bundling from the main package, but Radix UI components were still bundling their own React instances. Version 1.0.3 completes the fix.

### Problem in v1.0.2
Even after removing React from main dependencies, error still occurred because `@radix-ui/react-select` and other Radix UI packages were bundling their own React:

```
Warning: Invalid hook call...
at useScope (chunk-QGS26YSO.js)
at Select (@radix-ui_react-select.js)
```

### Complete Solution in v1.0.3
- ✅ Added esbuild alias to force all dependencies to use external React
- ✅ Configured `noExternal` for Radix UI packages (bundle them but use external React)
- ✅ All 43 React imports now use `require("react")` instead of bundled code
- ✅ Verified no React implementation code (`ReactCurrentDispatcher`) in bundle

### Changes Made

#### tsup.config.ts
```diff
  esbuildOptions(options) {
    options.conditions = ['module'];
+   // Ensure React is not bundled from any dependency
+   options.alias = {
+     'react': 'react',
+     'react-dom': 'react-dom',
+   };
  },
+ noExternal: [
+   // Bundle these but they will use external React
+   '@radix-ui/react-checkbox',
+   '@radix-ui/react-dialog',
+   '@radix-ui/react-dropdown-menu',
+   '@radix-ui/react-popover',
+   '@radix-ui/react-select',
+   '@radix-ui/react-slot',
+ ],
```

### Bundle Size
- v1.0.2: 111 KB (Radix UI external, caused errors)
- v1.0.3: 375 KB (Radix UI bundled, React external, works correctly)

The size increase is expected and correct - Radix UI components are now bundled but share React with your app.

### Testing Instructions

#### For Laravel Inertia Users:
1. Update package:
   ```bash
   npm install @madulinux/react-datatable@1.0.3
   ```

2. Clear build cache:
   ```bash
   npm run build
   php artisan view:clear
   ```

3. Restart dev server:
   ```bash
   npm run dev
   ```

4. Test - error should be completely gone!

### Verification Commands

```bash
# Should show 43 external React imports
grep -o "require(\"react\")" node_modules/@madulinux/react-datatable/dist/index.js | wc -l

# Should return nothing (no bundled React implementation)
grep "ReactCurrentDispatcher" node_modules/@madulinux/react-datatable/dist/index.js
```

---

# Release Notes v1.0.2 (Partial Fix)

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
