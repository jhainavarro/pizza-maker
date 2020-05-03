import { Component, Input } from "@angular/core";
import { FormArray } from "@angular/forms";
import { PRICE_PER_TOPPING, Toppings } from "./pizza-toppings.model";

@Component({
  selector: "app-pizza-toppings",
  template: `
    <p>Choose up to {{ maxToppings }} toppings</p>
    <ng-container
      *ngIf="freeToppings > 0; then hasFreeToppings; else noFreeToppings"
    ></ng-container>
    <label *ngFor="let topping of control.controls; let i = index">
      <input type="checkbox" [formControl]="control.controls[i]" />
      {{ toppings[i] }}
    </label>

    <ng-template #hasFreeToppings>
      <p>
        (You have {{ freeToppings }} free toppings! Additional toppings cost
        {{ PRICE_PER_TOPPING | currency }} each)
      </p>
    </ng-template>
    <ng-template #noFreeToppings>
      <p>(Toppings cost {{ PRICE_PER_TOPPING | currency }} each)</p>
    </ng-template>

    <app-validation
      *ngIf="control.invalid && (control.touched || control.dirty)"
      [errors]="this.control.errors"
    ></app-validation>
  `,
})
export class PizzaToppingsComponent {
  PRICE_PER_TOPPING = PRICE_PER_TOPPING;

  @Input() control: FormArray;
  @Input() freeToppings: number = 0;
  @Input() maxToppings: number;
  @Input() toppings: Toppings[];
}
