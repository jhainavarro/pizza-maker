import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Crust } from "./pizza-crust.model";

@Component({
  selector: "app-pizza-crust",
  template: `
    <p>What type of crust do you want?</p>
    <ng-container *ngFor="let crust of crusts">
      <label>
        <input
          type="radio"
          name="crust"
          [value]="crust"
          [formControl]="control"
        />
        {{ crust.name }} - {{ crust.price | currency }}
      </label>
    </ng-container>

    <app-validation
      *ngIf="control?.invalid && (control.touched || control.dirty)"
      [errors]="this.control.errors"
    >
    </app-validation>
  `,
})
export class PizzaCrustComponent {
  @Input() control: FormControl;
  @Input() crusts: Crust[];
}
