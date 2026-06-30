# Mozek-Angular 1.0.0 Documentation Updates

The upgrade to `mozek-angular` 1.0.0 introduces structural changes to component usage that must be reflected in the mozek-website documentation.

## Key Changes
- **Standalone Components Only**: `mozek-angular` no longer uses `CommonModule`. All components are standalone.
- **Signals Migration**: All internal states and component inputs now rely on Angular Signals.

## Documentation Updates Needed
1.  **Remove `CommonModule` imports**: Update all component setup examples to remove any mention or import of `CommonModule`.
2.  **Standalone Examples**: Provide examples demonstrating how to import individual components.
    ```typescript
    import { MozButton, MozInput } from "mozek-angular";

    @Component({
      selector: "app-my-component",
      standalone: true,
      imports: [MozButton, MozInput],
      templateUrl: "./my-component.html",
    })
    export class MyComponent {}
    ```
3.  **Highlight Signals Usage**: Update API references to note that inputs might now behave as signals, improving change detection and performance. Mention the transition to the new control flow (`@if`, `@for`).
