import { Component, Input } from "@angular/core";
import { FormArray } from "@angular/forms";
import { PRICE_PER_TOPPING, Toppings } from "./pizza-toppings.model";

@Component({
  selector: "app-pizza-toppings",
  template: `
    <ng-container *ngIf="freeToppings > 0; else noFreeToppings">
      <p>
        Your pizza comes with {{ freeToppings }} free toppings! You can have up
        to {{ maxToppings }}.
      </p>
      <p>Additional toppings cost {{ PRICE_PER_TOPPING | currency }} each.</p>
    </ng-container>
    <ng-template #noFreeToppings>
      <p>Toppings cost {{ PRICE_PER_TOPPING | currency }} each</p>
    </ng-template>

    <div class="checkbox-group">
      <mat-checkbox
        *ngFor="let topping of control.controls; let i = index"
        [formControl]="topping"
        class="checkbox"
      >
        {{ toppings[i] }}
      </mat-checkbox>
    </div>
  `,
  styles: [
    `
      .checkbox-group {
        display: flex;
        flex-direction: column;
        margin: 15px 0;
      }

      .checkbox {
        margin: 5px;
        text-transform: capitalize;
      }
    `,
  ],
})
export class PizzaToppingsComponent {
  PRICE_PER_TOPPING = PRICE_PER_TOPPING;

  @Input() control: FormArray;
  @Input() freeToppings: number = 0;
  @Input() maxToppings: number;
  @Input() toppings: Toppings[];
}
