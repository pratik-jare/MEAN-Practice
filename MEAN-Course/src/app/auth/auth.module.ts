import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { MatTableModule } from '@angular/material/table';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'users', component: UsersComponent },
];

@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent,
        UsersComponent,
    ],
    imports: [
        CommonModule,
        AngularMaterialModule,
        FormsModule, MatTableModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
})
export class AuthModule { }
