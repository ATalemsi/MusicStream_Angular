import {createFeatureSelector, createSelector} from "@ngrx/store";
import {TrackState} from "./track.reducer";

export const selectTrackState=  createFeatureSelector<TrackState>('tracks');
export const selectAllTracks = createSelector(selectTrackState , (state) => state.tracks);
export const selectTrackError=createSelector(selectTrackState , (state) => state.error)
export const selectTrackById = (id: string) =>
  createSelector(selectTrackState, (state) =>
    state.tracks.find((track) => track.id === id)
  );
