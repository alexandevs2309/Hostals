import { Injectable } from '@angular/core';

export interface UserCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface PropertyConfiguration {
  propertyName: string;
  propertyType: 'Hotel' | 'Resort' | 'Villa' | 'Apartahotel' | 'Hostal' | 'Bed & Breakfast' | 'Otro';
  roomCount: number;
  country: string;
  city: string;
  role: 'Propietario' | 'Director General' | 'Operaciones' | 'Recepción' | 'Finanzas' | 'Otro';
  selectedModules: ('PMS' | 'Reservas' | 'Habitaciones' | 'Housekeeping' | 'Mantenimiento' | 'Finanzas' | 'Analytics')[];
}

export interface OnboardingStep1Data {
  user: UserCredentials;
  termsAccepted: boolean;
}

export interface OnboardingStep2Data {
  property: PropertyConfiguration;
}

export type OnboardingData = {
  step1: OnboardingStep1Data | null;
  step2: OnboardingStep2Data | null;
};

export interface OnboardingState {
  currentStep: 1 | 2;
  step1Data: OnboardingStep1Data | null;
  step2Data: OnboardingStep2Data | null;
  dirty: boolean;
}

export const ONBOARDING_INITIAL_STATE: OnboardingState = {
  currentStep: 1,
  step1Data: null,
  step2Data: null,
  dirty: false
};
