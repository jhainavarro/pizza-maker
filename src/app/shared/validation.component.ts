import { Component, Input } from "@angular/core";
import { ValidationErrors } from "@angular/forms";

@Component({
  selector: "app-validation",
  template: `
    <div class="error">
      <ng-container *ngFor="let error of errorList">
        {{ error }}
      </ng-container>
    </div>
  `,
  styles: [
    `
      .error {
        color: red;
      }
    `,
  ],
})
export class ValidationComponent {
  @Input() errors: ValidationErrors | null;

  get errorList() {
    return this.errors ? Object.values(this.errors) : [];
  }
}
