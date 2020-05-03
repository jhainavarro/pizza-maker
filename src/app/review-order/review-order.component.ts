import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import * as Rx from "rxjs";
import { map } from "rxjs/operators";
import { PRICE_PER_TOPPING, Toppings } from "../pizza-toppings";

interface OrderItem {
  name: string;
  price: number;
}

@Component({
  selector: "app-review-order",
  template: `
    <mat-table [dataSource]="dataSource">
      <ng-container matColumnDef="name">
        <mat-cell *matCellDef="let item">
          {{ item.name }}
        </mat-cell>
        <mat-footer-cell *matFooterCellDef>Total</mat-footer-cell>
      </ng-container>

      <ng-container matColumnDef="price">
        <mat-cell *matCellDef="let item">
          {{ item.price | currency }}
        </mat-cell>
        <mat-footer-cell *matFooterCellDef
          >{{ total | currency }}
        </mat-footer-cell>
      </ng-container>

      <mat-row *matRowDef="let row; columns: displayedColumns"></mat-row>
      <mat-footer-row *matFooterRowDef="displayedColumns"></mat-footer-row>
    </mat-table>
  `,
  styles: [
    `
      .mat-table {
        margin-top: 15px;
        margin-bottom: 25px;
      }

      .mat-cell {
        text-transform: capitalize;
      }

      .mat-footer-row {
        font-weight: bold;
      }
    `,
  ],
})
export class ReviewOrderComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() freeToppings: number;
  @Input() toppings: Toppings[];
  @Input() total: number;

  dataSource: OrderItem[];
  displayedColumns: (keyof OrderItem)[];
  private dataSourceSubscription?: Rx.Subscription;

  ngOnInit() {
    this.displayedColumns = ["name", "price"];

    this.dataSourceSubscription = this.form.valueChanges
      .pipe(
        map((form) => {
          const sizeName = form.size?.name;
          const sizePrice = form.size?.price;

          const crustName = form.crust?.name;
          const crustPrice = form.crust?.price;

          const toppings = form.toppings;
          const selectedToppings = toppings
            ?.map((selected, i) => (selected ? this.toppings[i] : undefined))
            .filter((topping) => !!topping)
            .map((topping, i) => ({
              name: `${topping} ${i < this.freeToppings ? "(FREE)" : ""}`,
              price: i < this.freeToppings ? 0 : PRICE_PER_TOPPING,
            }));

          return [
            { name: `${sizeName} pizza`, price: sizePrice },
            { name: `${crustName} crust`, price: crustPrice },
            ...selectedToppings,
          ];
        })
      )
      .subscribe((data) => {
        this.dataSource = data;
      });
  }

  ngOnDestroy() {
    if (this.dataSourceSubscription) {
      this.dataSourceSubscription.unsubscribe();
    }
  }
}
