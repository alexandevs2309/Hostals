import { Routes } from '@angular/router';
import { GosShell } from './marketing-shell';
import { Landing } from '@/app/features/landing/landing';
import { FeaturesPage } from './pages/features-page';
import { SolutionsPage, SolutionDetailPage, IntegrationsPage } from './pages/solutions-pages';
import { ModulesPage, ModuleDetailPage } from './pages/modules-pages';
import { PricingPage, AboutPage, ContactPage, FaqPage } from './pages/info-pages';
import { BlogPage, BlogDetailPage } from './pages/blog-pages';

export const MARKETING_ROUTES: Routes = [
    {
        path: '',
        component: GosShell,
        children: [
            { path: '', pathMatch: 'full', component: Landing },
            { path: 'features', component: FeaturesPage },
            { path: 'solutions', component: SolutionsPage },
            { path: 'solutions/:kind', component: SolutionDetailPage },
            { path: 'modules', component: ModulesPage },
            { path: 'modules/:id', component: ModuleDetailPage },
            { path: 'integrations', component: IntegrationsPage },
            { path: 'pricing', component: PricingPage },
            { path: 'about', component: AboutPage },
            { path: 'contact', component: ContactPage },
            { path: 'faq', component: FaqPage },
            { path: 'blog', component: BlogPage },
            { path: 'blog/:slug', component: BlogDetailPage }
        ]
    }
];