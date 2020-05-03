import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import * as Rx from "rxjs";
import { filter, map, startWith } from "rxjs/operators";
import { Crust, Crusts } from "./pizza-crust";
import { Size, Sizes } from "./pizza-size";
import { PRICE_PER_TOPPING, Toppings } from "./pizza-toppings";
import { required, tooManyToppings } from "./validators/validators";

@Component({
  selector: "app-root",
  template: `
    <form>
      <mat-vertical-stepper linear>
        <mat-step
          label="Size"
          [stepControl]="sizeControl"
          errorMessage="Required"
        >
          <app-pizza-size
            [control]="sizeControl"
            [sizes]="SIZES"
          ></app-pizza-size>
          <button mat-button matStepperNext>Next</button>
        </mat-step>

        <mat-step
          label="Crust"
          [stepControl]="crustControl"
          errorMessage="Required"
        >
          <app-pizza-crust
            [control]="crustControl"
            [crusts]="CRUSTS"
          ></app-pizza-crust>
          <button mat-button matStepperPrevious>Back</button>
          <button mat-button matStepperNext>Next</button>
        </mat-step>

        <mat-step
          label="Toppings"
          [stepControl]="toppingsControl"
          optional
          [hasError]="
            (toppingsControl.touched || toppingsControl.dirty) &&
            pizza.errors?.tooManyToppings
          "
          errorMessage="Too many toppings selected"
        >
          <ng-container
            *ngIf="sizeControl?.valueChanges | async as size; else requireSize"
          >
            <app-pizza-toppings
              [control]="toppingsControl"
              [freeToppings]="FREE_TOPPINGS"
              [maxToppings]="size.maxToppings"
              [toppings]="TOPPINGS"
            ></app-pizza-toppings>
            <mat-error
              *ngIf="toppingsControl.touched && pizza.errors?.tooManyToppings"
              ><p>Choose up to {{ size.maxToppings }} only</p></mat-error
            >
          </ng-container>
          <ng-template #requireSize>
            <p>Please choose a pizze size first!</p>
          </ng-template>
          <button mat-button matStepperPrevious>Back</button>
          <button mat-button matStepperNext>Next</button>
        </mat-step>

        <mat-step label="Confirm order">
          TODO
        </mat-step>
      </mat-vertical-stepper>
    </form>

    <p>TOTAL: {{ total$ | async | currency }}</p>
  `,
})
export class AppComponent implements OnInit {
  readonly SIZES: Size[] = [
    { name: Sizes.SMALL, inches: 9, maxToppings: 5, price: 8 },
    { name: Sizes.MEDIUM, inches: 12, maxToppings: 7, price: 10 },
    { name: Sizes.LARGE, inches: 18, maxToppings: 9, price: 12 },
  ];

  readonly CRUSTS: Crust[] = [
    { name: Crusts.THIN, price: 2 },
    { name: Crusts.THICK, price: 4 },
  ];

  readonly TOPPINGS = Object.values(Toppings);

  readonly FREE_TOPPINGS = 3;

  pizza: FormGroup;
  total$: Rx.Observable<number>;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.pizza = this.fb.group(
      {
        size: [null, required("Please select a pizza size")],
        crust: [null, required("Please select the crust thickness")],
        toppings: this.buildToppingsControl(),
      },
      { validators: tooManyToppings("Too many toppings") }
    );

    const sizePrice$ = this.sizeControl.valueChanges.pipe(
      filter((size) => !!size),
      map((size: Size) => size.price),
      startWith(0)
    );

    const crustPrice$ = this.crustControl.valueChanges.pipe(
      filter((crust) => !!crust),
      map((crust: Crust) => crust.price),
      startWith(0)
    );

    const toppingsPrice$ = this.toppingsControl.valueChanges.pipe(
      map((toppings: boolean[]) => toppings?.filter((selected) => !!selected)),
      map((selectedToppings) => {
        const paidToppings = Math.max(
          0,
          selectedToppings.length - this.FREE_TOPPINGS
        );

        return paidToppings * PRICE_PER_TOPPING;
      }),
      startWith(0)
    );

    this.total$ = Rx.combineLatest([
      sizePrice$,
      crustPrice$,
      toppingsPrice$,
    ]).pipe(
      map(([sizePrice, crustPrice, toppingsPrice]) => {
        return sizePrice + crustPrice + toppingsPrice;
      })
    );
  }

  get sizeControl() {
    return this.pizza.get("size");
  }

  get crustControl() {
    return this.pizza.get("crust");
  }

  get toppingsControl() {
    return this.pizza.get("toppings") as FormArray;
  }

  private buildToppingsControl() {
    const controls = this.TOPPINGS.map(() => this.fb.control(false));
    return this.fb.array(controls);
  }

  // TODO: Send to backend + success / loading / error handling
  onSubmit() {
    this.pizza.markAllAsTouched();
    this.pizza.updateValueAndValidity();
  }
}
