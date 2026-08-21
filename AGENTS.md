# Project Rules & Guidelines

This is a Laravel + React (Inertia.js) template project. When working on this repository, you **MUST** use the existing reusable components available in `resources/js/components/` instead of building new components from scratch or using raw HTML elements (like standard `<input>` or `<button>`).

## Component Library

Always import and use these predefined components:

### Common & Layout (`@/components/common/`)
- **`Button`** (`Button.jsx`): Use for all buttons. Supports variants (`primary`, `danger`, `default`), sizes, and `loading` props.
- **`DataTable`** (`DataTable.jsx`): The standard component for data listing, searching, sorting, and pagination.
- **`ModalGlobal`** (`GlobalModal.jsx`): Use for all popup modals. Connects automatically to our Zustand store via `name` prop.
- **`Modal`** (`Modal.jsx`): The base modal. Usually, you should prefer `ModalGlobal` for easier state management.
- **`Tooltip`** (`Tooltip.jsx`): Wrapper for tooltip popovers.
- **`IconPicker`** (`IconPicker.jsx`): Component to select icons.

### Inputs (`@/components/input/`)
- **`InertiaTextInput`** (`RenderTextInput.jsx`): Standard input for text, email, password, etc. Automatically handles Inertia `error` props.
- **`RenderTextArea`** (`RenderTextArea.jsx`): Multi-line text input.
- **`AsyncSelectInput`** (`AsyncSelectInput.jsx`): Use for all `<select>` needs, dropdowns, or remote searchable dropdowns.
- **`ToggleCheckbox`** (`ToggleCheckbox.jsx`): Switch toggle or styled checkbox.
- **`ImageUpload`** (`ImageUpload.jsx`): Drag-and-drop or click-to-upload image component.

### UI Primitives (`@/components/ui/`)
- **`Avatar`** (`Avatar.jsx`): User profile display.
- **`Badge`** (`Badge.jsx`): Highlight statuses (e.g., active, inactive, pending).
- **`Table`**, **`THead`**, **`Tr`**, **`Th`**, **`Td`** (`Table.jsx`): Raw table structural components. Prefer `DataTable` unless a completely custom layout is required.

## Conventions

1. **State Management**: Modals are controlled globally via `useModalGlobal(modalName)` from `@/store/modalStore`. This hook provides `openModal(data, isEdit)`, `closeModal()`, and exposes `data` and `isEdit`.
2. **Icons**: Always use `@tabler/icons-react` for iconography.
3. **Forms**: Use `@inertiajs/react` `useForm()` hook for state and submission management. Combine it with the Input components above.
4. **TailwindCSS & Theming (CRITICAL)**: **NEVER create or use custom/hardcoded colors** (e.g. `bg-[red]`, `#ff0000`, `text-blue-600`). ALWAYS use the predefined theme utility classes (e.g., `text-primary`, `bg-card`, `bg-page`, `text-main`, `text-muted`, `border-stroke`). Components like `Button` and `DataTable` already encapsulate these theme colors. Sticking to the theme variables ensures perfect consistency across dark/light mode toggles.
5. **Saving Tokens & Sensitive Data**: NEVER use raw `localStorage.setItem` or `sessionStorage` to save tokens (e.g., auth tokens, API keys) or sensitive data. You MUST use the `setItem`, `getItem`, and `removeItem` functions provided in `@/utils/localstroage.jsx`. This utility ensures all keys and values are automatically encrypted on the client side.

## Utilities & Helpers (`@/utils/`)

Before writing custom helper functions, check if an existing utility covers your needs:

- **`encrypt.jsx`**: Provides `doEncrypt(data, ignore[])` and `doDecrypt(data, ignore[])` for encrypting/decrypting strings, objects, and arrays.
- **`localstroage.jsx`**: Provides `setItem(key, value)`, `getItem(key)`, and `removeItem(key)`. These automatically encrypt the keys and values before saving to the browser's localStorage. Always use these instead of raw `localStorage` for security.
- **`humanize.js`**: Provides `humanizeEnum(value, sep)` to convert enum strings (like `kepala_toko`) to human-readable strings (`Kepala Toko`).
- **`isMobile.jsx`**: Provides the `useIsMobile()` hook to detect if the user is on a mobile device (useful for responsive rendering logic).

## AI Behavior & Token Conservation (MANDATORY)

The AI Agent MUST minimize token/context usage while preserving correctness.

1. **Search Before Reading**
   - Search for the exact route, symbol, component, controller, model, or function first.
   - Never scan the entire repository unless explicitly required.

2. **Use Minimum Context**
   - Read only the smallest relevant section of a file.
   - Prefer precise `StartLine` / `EndLine` ranges.
   - Start with at most 3–5 relevant files.
   - Expand only when the current evidence is insufficient.

3. **Laravel + Inertia Trace**
   Follow the actual request flow:

   `route → controller → FormRequest → service/action (if used) → model/query → Inertia::render → referenced React page → direct component`

   Do not inspect unrelated controllers, models, routes, pages, or components.

4. **Inertia Rules**
   - When encountering `Inertia::render()`, inspect only the referenced page.
   - For `useForm()`: trace `form → route → validation → controller → persistence`.
   - For shared props, check `HandleInertiaRequests::share()` first.

5. **Eloquent Rules**
   Follow:

   `query → model → relationship/scope → migration/index only if required`

   Do not inspect all models or migrations.

6. **Reuse Existing Context**
   - Do not re-read files or code already inspected in the current task.
   - Re-read only when the file changed or another section is required.

7. **Targeted Edits**
   - Make the smallest possible change.
   - Prefer surgical replace/edit operations.
   - Never rewrite an entire file for a small modification.
   - Do not refactor unrelated code.

8. **Existing Components First**
   Before creating UI, search `resources/js/components/` for an existing reusable component.

   Prefer existing:
   `Button`, `DataTable`, `ModalGlobal`, `InertiaTextInput`,
   `RenderTextArea`, `AsyncSelectInput`, `ToggleCheckbox`,
   `ImageUpload`, `Badge`, `Avatar`, etc.

   Never create duplicate components when an existing component satisfies the requirement.

9. **Existing Utilities First**
   Before creating helpers, check `@/utils/`.

   Reuse existing utilities whenever possible.

10. **Ignore Irrelevant Files**
    Do not inspect these unless directly relevant:

    `vendor/`
    `node_modules/`
    `storage/`
    `bootstrap/cache/`
    `public/build/`
    `package-lock.json`
    `composer.lock`
    `*.map`
    `*.min.js`

11. **Debugging**
    Follow:

    `error → first application stack frame → relevant function → caller → direct dependency`

    Ignore framework/vendor stack frames unless required.

12. **Minimal Output**
    Keep responses concise.

    For fixes, normally provide only:
    - root cause
    - change made
    - important impact

    Do not reproduce unchanged code or entire files.

13. **Stop Rule**
    Stop searching when:
    - root cause is identified,
    - relevant dependencies are understood,
    - impact is understood,
    - a safe implementation can be made.

    `Enough context > maximum context.`

14. **Direct Action**
    If the user's intent is clear, execute the required search/edit directly.
    Avoid unnecessary confirmation questions.

15. **Codebase Memory**
    If Codebase Memory MCP is available, use it first for repository exploration.

    Prefer:
    `symbol search → definition → references → targeted file read`

    over manually browsing directories or reading full files.


## Final Efficiency Rules

- Treat this file as authoritative project context. Do not repeatedly inspect files only to verify rules already defined here.
- Do not inspect reusable component implementations unless their API/behavior is required for the current task.
- Do not inspect utility implementations unless their behavior is unclear or directly related to the issue.
- Use Codebase Memory MCP for symbol/reference discovery when available.
- If Codebase Memory already provides enough context, do not perform additional file reads.
- Never explore unrelated code "just in case".
- Prefer one targeted search over multiple broad searches.
- Prefer one targeted edit over rewriting a complete file.
- Do not explain unchanged code.
- Do not summarize files that were only inspected as dependencies.
- Stop tool usage immediately once enough evidence exists to safely complete the task.