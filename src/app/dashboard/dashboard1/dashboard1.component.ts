import { Component, Injectable } from '@angular/core';
import { Jsonp, URLSearchParams, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { debounceTime } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import * as tableData from '../../shared/data/smart-data-table';
import { LocalDataSource } from 'ng2-smart-table';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/api';
import { DragulaService } from 'ng2-dragula';
import * as alertFunctions from '../../shared/data/sweet-alerts';
import swal from 'sweetalert2';

@Component({
    selector: 'app-dashboard1',
    templateUrl: './dashboard1.component.html',
    styleUrls: ['./dashboard1.component.scss'],
    providers: [MessageService, ConfirmationService, DragulaService]
})

export class Dashboard1Component {

    country: any;
    countries: any[];
    filteredCountriesSingle: any[];

    source: LocalDataSource;
    filterSource: LocalDataSource;
    alertSource: LocalDataSource;

    lastL: number = 0;
    cars: any[];
    cols: any[];

    constructor(private http: Http, private messageService: MessageService, private confirmationService: ConfirmationService) {
        this.source = new LocalDataSource(tableData.data); // create the source
        this.filterSource = new LocalDataSource(tableData.filerdata); // create the source
        this.alertSource = new LocalDataSource(tableData.alertdata); // create the source
    }

    filterCountrySingle(event) {
        let query = event.query;
        this.getCountries().then(countries => {
            this.filteredCountriesSingle = this.filterCountry(query, countries);
        });
    }

    filterCountry(query, countries: any[]): any[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered: any[] = [];
        for (let i = 0; i < countries.length; i++) {
            let country = countries[i];
            if (country.CODICE_RISORSA.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }
        return filtered;
    }

    getCountries() {
        return this.http.get('http://localhost:3000/api/piano/machines')
            .toPromise()
            .then(res => <any[]>res.json())
        //.then(data => { return data; });
    }

    getOrders() {
        return this.http.get('http://localhost:3000/api/piano/orders')
            .toPromise()
            .then(res => <any[]>res.json())
        //.then(data => { return data; });
    }

    getOrdersById() {
        return this.http.get('http://localhost:3000/api/piano/orders/' + this.country.CODICE_RISORSA)
       //return this.http.get('http://localhost:3000/api/piano/orders/S003')
            .toPromise()
            .then(res => <any[]>res.json())
    }

    selectedmachin() {
        this.getOrdersById().then(countries => {
            this.cars = countries;
            let maxval = this.cars.filter(a => a.priorita_ordine != 999);
            for (let i = 0; i < this.cars.length; i++) {
                if (i > (maxval.length - 1)) {
                    this.cars[i]['edit'] = false;
                } else {
                    this.cars[i]['edit'] = true;
                }
                if (i == (maxval.length - 1)) {
                    this.cars[i]['lastLine'] = 'true';
                } else {
                    this.cars[i]['lastLine'] = 'false';
                }
            }
        });
    }


    ngOnInit() {

        this.cols = [
            { field: 'codice_risorsa', header: 'CODICE_RISORSA' },
            { field: 'codice_ordine', header: 'CODICE_ORDINE' },
            { field: 'codice_parte', header: 'CODICE_PARTE' },
            { field: 'priorita_ordine', header: 'PRIORITA_ORDINE' },
            { field: '', header: 'ACTION' }
        ];
    }

    updateOrder() {
        swal({
            title: 'Are you sure to update it?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0CC27E',
            cancelButtonColor: '#FF586B',
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success btn-raised mr-5',
            cancelButtonClass: 'btn btn-danger btn-raised',
            buttonsStyling: false
        }).then((isConfirm) => {
            console.log(isConfirm)
            if (!isConfirm.value) {
                swal(
                    'Cancelled',
                    'Your request is cancelled :)',
                    'error'
                )
            } else {
                this.updateOrdercall();
            }
        }, function (dismiss) {
            // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            if (dismiss === 'cancel') {
                swal(
                    'Cancelled',
                    'Your imaginary file is safe :)',
                    'error'
                )
            }
        })
    }

    updateOrdercall() {
        for (let i = 0; i < this.cars.length; i++) {
            this.updateOrderService(this.cars[i]['codice_ordine'], this.cars[i]['priorita_ordine'])
                .subscribe(data => {
                    if (i == (this.cars.length - 1)) {
                        if (data) {

                            swal(
                                'Updated!',
                                'Your records has been updated.',
                                'success'
                            )
                        }
                        else
                            this.messageService.add({ severity: 'error', summary: 'Error  Message', detail: 'Order update failed' });
                    }
                });
        }
    }

    updateOrderService(CODICE_ORDINE, PRIORITA_ORDINE) {
        const body = JSON.stringify({
            "CODICE_ORDINE": CODICE_ORDINE,
            "PRIORITA_ORDINE": PRIORITA_ORDINE
        });

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        console.log(JSON.stringify(body));

        return this.http.put('http://localhost:3000/api/piano/orders/order', body, {
            headers: headers
        }).pipe(map((response: any) => response.json()));
    }

    onRowReorder(event, row) {
        for (let i = 0; i < this.cars.length; i++) {
            if (this.cars[i]['priorita_ordine'] != 999)
                this.cars[i]['priorita_ordine'] = i + 1;
        }
        if (event.dragIndex != event.dropIndex) {
            if (event.dragIndex <= event.dropIndex) {
                this.cars[event.dropIndex - 1]['priorita_ordine'] = event.dropIndex;
                //this.cars[event.dragIndex]['priorita_ordine'] = event.dragIndex + 1;
            } else {
                this.cars[event.dropIndex]['priorita_ordine'] = event.dropIndex + 1;
                //this.cars[event.dragIndex]['priorita_ordine'] = event.dragIndex + 1;
            }
        }
        if (this.lastL != 0) {
            this.lastLine(this.lastL - 1);
        }
    }

    lastLine(index) {
        this.lastL = index + 1;
        for (let i = 0; i < this.cars.length; i++) {
            if (i > index) {
                this.cars[i]['priorita_ordine'] = 999;
                this.cars[i]['edit'] = false;
            } else {
                this.cars[i]['priorita_ordine'] = i + 1;
                this.cars[i]['edit'] = true;
            }
            if (i == index) {
                this.cars[i]['lastLine'] = 'true';
            } else {
                this.cars[i]['lastLine'] = 'false';
            }
        }
    }
}
