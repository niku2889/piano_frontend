import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { DashboardRoutingModule } from "./dashboard-routing.module";
import { ChartistModule } from 'ng-chartist';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatchHeightModule } from "../shared/directives/match-height.directive";

import { Dashboard1Component } from "./dashboard1/dashboard1.component";
import { Dashboard2Component } from "./dashboard2/dashboard2.component";

import { AutoCompleteModule } from 'primeng/autocomplete';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TableModule } from 'primeng/table';
import { GrowlModule } from 'primeng/growl';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PrimeDragulaDirective } from './dashboard1/primeDragula';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        DashboardRoutingModule,
        ChartistModule,
        NgbModule,
        MatchHeightModule,
        AutoCompleteModule,
        Ng2SmartTableModule,
        TableModule,
        GrowlModule,
        ConfirmDialogModule
    ],
    exports: [],
    declarations: [
        Dashboard1Component,
        Dashboard2Component,
        PrimeDragulaDirective
    ],
    providers: [],
})
export class DashboardModule { }
