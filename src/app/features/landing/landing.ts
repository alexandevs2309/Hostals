import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GosSectionHero } from './components/section-hero';
import { GosMarquee } from '@/app/shared/components/marquee';
import { GosSectionFeatures } from './components/section-features';
import { GosSectionModules } from './components/section-modules';
import { GosSectionOperations } from './components/section-operations';
import { GosSectionScreens } from './components/section-screens';
import { GosSectionReservationsDetail, GosSectionHousekeepingDetail, GosSectionGuestsDetail, GosSectionMaintenanceDetail, GosSectionAnalyticsDetail } from './components/section-details';
import { GosSectionTestimonials } from './components/section-testimonials';
import { GosSectionPricing, GosSectionFaq } from './components/section-pricing-faq';
import { GosCtaSection } from '@/app/shared/components/cta-section';
import { HOTEL_NAMES } from '@/app/shared/data/mock.data';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [
        CommonModule,
        GosSectionHero,
        GosMarquee,
        GosSectionFeatures,
        GosSectionModules,
        GosSectionOperations,
        GosSectionScreens,
        GosSectionReservationsDetail,
        GosSectionHousekeepingDetail,
        GosSectionGuestsDetail,
        GosSectionMaintenanceDetail,
        GosSectionAnalyticsDetail,
        GosSectionTestimonials,
        GosSectionPricing,
        GosSectionFaq,
        GosCtaSection
    ],
    template: `
        <div class="gos-landing">
            <gos-section-hero />
            <gos-marquee [items]="hotels" />
            <gos-section-features />
            <gos-section-modules />
            <gos-section-operations />
            <gos-section-screens />
            <gos-section-reservations-detail />
            <gos-section-housekeeping-detail />
            <gos-section-guests-detail />
            <gos-section-maintenance-detail />
            <gos-section-analytics-detail />
            <gos-section-testimonials />
            <gos-section-pricing />
            <gos-section-faq />
            <gos-cta-section />
        </div>
    `
})
export class Landing {
    hotels = HOTEL_NAMES;
}