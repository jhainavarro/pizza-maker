import { Component, Input } from "@angular/core";
import { FormArray, FormControl } from "@angular/forms";
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

    <div class="container">
      <mat-card
        *ngFor="let topping of control.controls; let i = index"
        class="card"
        [ngClass]="{ 'is-selected': topping.value }"
        (click)="toggle(topping)"
      >
        <img
          mat-card-image
          src="https://picsum.photos/200"
          [alt]="toppings[i]"
        />

        <mat-card-title class="name">{{ toppings[i] }}</mat-card-title>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-flow: row wrap;
        margin: 15px 0;
        max-width: 750px;
      }

      .card {
        min-height: 100px;
        width: 100px;
        margin: 8px;
      }

      .name {
        font-size: 20px;
        text-align: center;
        text-transform: capitalize;
      }

      .is-selected {
        color: red;
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

  toggle(topping: FormControl) {
    topping.setValue(!topping.value);
    topping.markAsTouched();
  }
}
