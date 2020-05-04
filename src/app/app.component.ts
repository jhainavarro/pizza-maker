import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import * as Rx from "rxjs";
import { filter, map, startWith } from "rxjs/operators";
import { Crust, Crusts } from "./pizza-crust";
import { Size, Sizes } from "./pizza-size";
import { PRICE_PER_TOPPING, Topping, Toppings } from "./pizza-toppings";
import { required, tooManyToppings } from "./validators/validators";

enum Status {
  SUCCESS = "success",
  ERROR = "error",
}

@Component({
  selector: "app-root",
  template: `
    <form class="form">
      <div class="form-title">Create your own pizza</div>

      <mat-vertical-stepper linear>
        <!-- STEP 1: SIZE -->
        <mat-step
          label="Size"
          [stepControl]="sizeControl"
          errorMessage="Required"
        >
          <app-pizza-size
            [control]="sizeControl"
            [sizes]="SIZES"
          ></app-pizza-size>

          <button mat-button mat-stroked-button matStepperNext>Next</button>
        </mat-step>

        <!-- STEP 2: CRUST -->
        <mat-step
          label="Crust"
          [stepControl]="crustControl"
          errorMessage="Required"
        >
          <app-pizza-crust
            [control]="crustControl"
            [crusts]="CRUSTS"
          ></app-pizza-crust>

          <button mat-button mat-stroked-button matStepperPrevious>Back</button>
          <button mat-button mat-stroked-button matStepperNext>Next</button>
        </mat-step>

        <!-- STEP 3: TOPPINGS -->
        <mat-step
          label="Toppings"
          [stepControl]="toppingsControl"
          optional
          [hasError]="pizza.errors?.tooManyToppings"
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
              *ngIf="
                (toppingsControl.touched || toppingsControl.dirty) &&
                pizza.errors?.tooManyToppings
              "
              ><p>Choose up to {{ size.maxToppings }} only</p></mat-error
            >
          </ng-container>

          <ng-template #requireSize>
            <p>Please choose a pizze size first!</p>
          </ng-template>

          <button mat-button mat-stroked-button matStepperPrevious>Back</button>
          <button mat-button mat-stroked-button matStepperNext>Next</button>
        </mat-step>

        <!-- STEP 4: CONFIRM -->
        <mat-step label="Confirm order">
          <mat-error *ngIf="pizza.invalid">
            Oops, there's an error with your order. Please review them first
            before submitting your order.
          </mat-error>

          <app-review-order
            [hidden]="pizza.invalid"
            [form]="pizza"
            [toppings]="TOPPINGS"
            [freeToppings]="FREE_TOPPINGS"
            [total]="total$ | async"
          ></app-review-order>

          <ng-container *ngIf="showActionButtons$ | async">
            <button mat-button mat-stroked-button matStepperPrevious>
              Back
            </button>
            <button
              mat-button
              mat-raised-button
              color="primary"
              [ngClass]="{ spinner: isSubmitting$ | async }"
              [disabled]="isSubmitting$ | async"
              (click)="submitOrder()"
            >
              Confirm
            </button>
          </ng-container>

          <div *ngIf="status$ | async as status">
            <p *ngIf="status === Status.SUCCESS" class="success">
              Order submitted!
            </p>
            <mat-error *ngIf="status === Status.ERROR">
              There was a problem submitting your order :( Please try again.
            </mat-error>
          </div>
        </mat-step>
      </mat-vertical-stepper>
    </form>
  `,
  styles: [
    `
      .form {
        width: 1000px;
        border: 1px solid rgba(0, 0, 0, 0.03);
        box-shadow: 0 2px 2px rgba(0, 0, 0, 0.24), 0 0 2px rgba(0, 0, 0, 0.12);
        margin: 40px auto;
      }

      .form-title {
        background: rgba(0, 0, 0, 0.03);
        color: rgba(0, 0, 0, 0.54);
        font-size: 20px;
        padding: 20px;
      }

      .mat-button:first-of-type {
        margin-right: 8px;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  Status = Status;

  readonly SIZES: Size[] = [
    { name: Sizes.SMALL, inches: 9, maxToppings: 5, price: 8 },
    { name: Sizes.MEDIUM, inches: 12, maxToppings: 7, price: 10 },
    { name: Sizes.LARGE, inches: 18, maxToppings: 9, price: 12 },
  ];

  readonly CRUSTS: Crust[] = [
    { name: Crusts.THIN, price: 2 },
    { name: Crusts.THICK, price: 4 },
  ];

  readonly TOPPINGS: Topping[] = [
    { name: Toppings.PEPPERONI, src: "assets/pepperoni.jpeg" },
    { name: Toppings.MUSHROOMS, src: "assets/mushrooms.png" },
    { name: Toppings.ONIONS, src: "assets/onions.jpg" },
    { name: Toppings.SAUSAGE, src: "assets/sausage.jpg" },
    { name: Toppings.BLACK_OLIVES, src: "assets/black-olives.jpg" },
    { name: Toppings.EXTRA_CHEESE, src: "assets/cheese.jpeg" },
    { name: Toppings.BACON, src: "assets/bacon.jpg" },
    { name: Toppings.GREEN_PEPPERS, src: "assets/green-peppers.jpg" },
    { name: Toppings.PINEAPPLE, src: "assets/pineapple.jpg" },
    { name: Toppings.SPINACH, src: "assets/spinach.jpg" },
  ];

  readonly FREE_TOPPINGS = 3;

  pizza: FormGroup;
  showActionButtons$: Rx.Observable<boolean>;
  total$: Rx.Observable<number>;

  private isSubmittingSubject: Rx.BehaviorSubject<boolean>;
  isSubmitting$: Rx.Observable<boolean>;

  private statusSubject: Rx.BehaviorSubject<Status | null>;
  status$: Rx.Observable<Status>;

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

    this.isSubmittingSubject = new Rx.BehaviorSubject<boolean>(false);
    this.isSubmitting$ = this.isSubmittingSubject.asObservable();

    this.statusSubject = new Rx.BehaviorSubject<Status>(null);
    this.status$ = this.statusSubject.asObservable();

    this.showActionButtons$ = Rx.combineLatest([
      this.pizza.statusChanges,
      this.status$,
    ]).pipe(
      map(
        ([formStatus, submitStatus]) =>
          formStatus !== "INVALID" && submitStatus !== Status.SUCCESS
      )
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

  // TODO: Send to backend
  submitOrder() {
    this.isSubmittingSubject.next(true);
    this.statusSubject.next(null);

    Rx.timer(3000)
      // .pipe(switchMap(() => Rx.throwError("test"))) // Test error handling
      .toPromise()
      .then(() => {
        this.statusSubject.next(Status.SUCCESS);
      })
      .catch(() => {
        this.statusSubject.next(Status.ERROR);
      })
      .finally(() => {
        this.isSubmittingSubject.next(false);
      });
  }
}
