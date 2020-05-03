import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatRadioModule } from "@angular/material/radio";
import { MatStepperModule } from "@angular/material/stepper";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PizzaCrustComponent } from "./pizza-crust/pizza-crust.component";
import { PizzaSizeComponent } from "./pizza-size/pizza-size.component";
import { PizzaToppingsComponent } from "./pizza-toppings/pizza-toppings.component";

@NgModule({
  declarations: [
    AppComponent,
    PizzaSizeComponent,
    PizzaCrustComponent,
    PizzaToppingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
