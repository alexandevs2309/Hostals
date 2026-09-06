import { Routes } from '@angular/router';
import { TermsComponent } from './terms.component';
import { PrivacyComponent } from './privacy.component';
import { AccountShell } from '@/app/features/account/auth-shell';

export default [
    {
        path: '',
        component: AccountShell,
        children: [
            { path: 'terminos', component: TermsComponent },
            { path: 'privacidad', component: PrivacyComponent }
        ]
    }
] as Routes;
