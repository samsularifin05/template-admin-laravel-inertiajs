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

## Utilities & Helpers (`@/utils/`)

Before writing custom helper functions, check if an existing utility covers your needs:

- **`encrypt.jsx`**: Provides `doEncrypt(data, ignore[])` and `doDecrypt(data, ignore[])` for encrypting/decrypting strings, objects, and arrays.
- **`localstroage.jsx`**: Provides `setItem(key, value)`, `getItem(key)`, and `removeItem(key)`. These automatically encrypt the keys and values before saving to the browser's localStorage. Always use these instead of raw `localStorage` for security.
- **`humanize.js`**: Provides `humanizeEnum(value, sep)` to convert enum strings (like `kepala_toko`) to human-readable strings (`Kepala Toko`).
- **`isMobile.jsx`**: Provides the `useIsMobile()` hook to detect if the user is on a mobile device (useful for responsive rendering logic).
