import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Size } from "./pizza-size.model";

@Component({
  selector: "app-pizza-size",
  template: `
    <mat-radio-group [formControl]="control" class="radio-group" required>
      <mat-radio-button
        *ngFor="let size of sizes"
        [value]="size"
        class="radio-button"
      >
        {{ size.name }} ({{ size.inches }}") - {{ size.price | currency }}
      </mat-radio-button>
    </mat-radio-group>
  `,
})
export class PizzaSizeComponent {
  @Input() control: FormControl;
  @Input() sizes: Size[];
}
