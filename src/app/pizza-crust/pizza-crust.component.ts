import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Crust } from "./pizza-crust.model";

@Component({
  selector: "app-pizza-crust",
  template: `
    <mat-radio-group [formControl]="control" class="radio-group">
      <mat-radio-button
        *ngFor="let crust of crusts"
        [value]="crust"
        class="radio-button"
      >
        {{ crust.name }} - {{ crust.price | currency }}
      </mat-radio-button>
    </mat-radio-group>
  `,
})
export class PizzaCrustComponent {
  @Input() control: FormControl;
  @Input() crusts: Crust[];
}
