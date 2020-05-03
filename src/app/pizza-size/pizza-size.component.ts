import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Size } from "./pizza-size.model";

@Component({
  selector: "app-pizza-size",
  template: `
    <p>How big do you want your pizza?</p>
    <ng-container *ngFor="let size of sizes">
      <label>
        <input
          type="radio"
          name="size"
          [value]="size"
          [formControl]="control"
        />
        {{ size.name }} ({{ size.inches }}") - {{ size.price | currency }}
      </label>
    </ng-container>

    <app-validation
      *ngIf="control?.invalid && (control.touched || control.dirty)"
      [errors]="this.control.errors"
    ></app-validation>
  `,
})
export class PizzaSizeComponent {
  @Input() control: FormControl;
  @Input() sizes: Size[];
}
