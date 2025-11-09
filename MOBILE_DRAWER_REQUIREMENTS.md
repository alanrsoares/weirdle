# Mobile Drawer Requirements

## Status

✅ All dependencies installed: `framer-motion`, `@radix-ui/react-dialog`

## Requirements

### 1. Drag Handle (Mobile Only)

- Visual indicator at top of drawer (gray rounded bar)
- Touch-friendly (44x44px min)
- Only visible on `< sm` breakpoint

### 2. Drag-to-Close

- Vertical drag only (`drag="y"`)
- Close when dragged down >100px or 30% height
- Snap back if threshold not met
- Integrate with Radix `onOpenChange`

### 3. Implementation

```tsx
// Wrap DialogPrimitive.Content with motion.div (mobile only)
- drag="y" with constraints
- onDragEnd handler to check threshold
- Drag handle component at top
```

## Implementation Steps

1. Add drag handle component (mobile only)
2. Wrap content with `motion.div`, add `drag="y"`
3. Implement `onDragEnd` → check threshold → call `onOpenChange(false)`
4. Handle scroll conflicts (drag only on handle or detect scroll)

## Notes

- Mobile breakpoint: `< sm` (640px)
- Desktop unchanged (centered modal)
- Use framer-motion's built-in touch handling
