import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyMaterialModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    HttpClientModule   
    ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  formGroup = new FormGroup(<any>{});
  fields?: FormlyFieldConfig[];
  model: { 
    gateway: 'tap' | 'stripe' | 'tamara';
    [keys: string]: any
   } = {
    gateway: 'tap'
   }

  cards={
    tap: [
      {label: 'visa', value: '4012000033330026'},
      {label: 'Master Card', value: '5111111111111118'},
      {label: 'American Express', value: '371449635398431'},     
    ],
    stripe:[
      {label: 'visa', value: '4242424242424242'},
      {label: 'Master Card', value: '5555555555554444'},
      {label: 'American Express', value: '378282246310005'}, 
    ],
    tamara:[
      {label: 'visa', value: '4111111111111111'},
      {label: 'Master Card', value: '5436031030606378'},
      {label: 'American Express', value: '345678901234564'}, 
    ]
  }

  constructor(private http: HttpClient){}

  ngOnInit(): void {
   this.fields=[ 
    {
     key: 'gateway',
     type: 'select',
     defaultValue:'tap',
     props: {
       label: 'payment gateway',
       required: true,
       options:[
        {label: 'Tap', value:'tap'},
        {label: 'Tamara', value:'tamara'},
        {label: 'Stripe', value:'stripe'},
       ]
    },
  },

  {
    key: 'amount',
    type: 'input',
    defaultValue:'1',
    props: {
      label: 'amount in SAR',
      required: true
   },
 },

]    
  }

  onSubmit(){
   let baseUrl='http://localhost:3000/api/v1.0',
   token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZjExODIzZi1jOGZhLTQyZTctODNiNS1jZmY5MmViMzU4YzEiLCJyb2xlIjoic3lzdGVtIGFkbWluIiwiaWF0IjoxNzAwMTI4MzA0LCJleHAiOjE3MDAxMzE5MDR9.Q-nPcPXk_vNb59xaj8wJAEGSF4RbMBYk-xVpc3ta0oFYJXFsDXChQwN-oIy07isOHmNvSakmJT5V6vBM0BCmexqloPikOxThlVxwJ84NWwuxazhxwxnIP4qHvyKcrQ5_lMMfn94HsSLu15Cz9sfqqN4LhkYw-Ytw_-GRCdpePAl83k7DClDU8fP351P5eRm_RySRuYpOfSfg9ZVva3y-kiZyg1QKuzXLMBVjyiN1nI5ZC1ndzwk1t4cd1l3c1jfjFrbLS2RASQy-svYJlCAGbKsq1NQ97-_tMEAQTULSaE41ELT3KyZ_WAodWTq86qWL4YIotdPR8Tu_wkgCxXqAZg',
   storeId = 'c4372b70-b3f0-4110-9a4a-422b308b6619',
   checkout = {
    payment_methods: [
      "Credit Card"
    ],
    storeId,
    capturing: true,
    voiding: false,
    amount: 100000,
    currency: "USD",
    redirect_url: "https://example.com/payments/done/{CHECKOUT_ID}/{CHECKOUT_STATUS}",
    gateway_Provider: this.model['gateway'],
    items: [
      {
        name: "Premium account",
        price: 100,
        quantity: 1
      }
    ],
    customer: {
      name: "John david",
      email: "john.david@gmail.com",
      mobile: "+14844731795"
    }
  }


   this.http.post(`${baseUrl}/checkout`,checkout,{
    headers:{ Authorization: `Bearer ${token}`}
   }).subscribe({
    next: (res:any)=>location.href=res.redirect_url
   })
  }

}
