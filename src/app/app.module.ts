import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PizzaCrustComponent } from "./pizza-crust/pizza-crust.component";
import { PizzaSizeComponent } from "./pizza-size/pizza-size.component";
import { PizzaToppingsComponent } from "./pizza-toppings/pizza-toppings.component";
import { ValidationComponent } from "./shared/validation.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    PizzaSizeComponent,
    PizzaCrustComponent,
    PizzaToppingsComponent,
    ValidationComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
