import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import {TrackEffects} from "./features/track/store/track.effects";
import {trackReducer} from "./features/track/store/track.reducer";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideStore({tracks: trackReducer,}), provideEffects([TrackEffects])]
};
