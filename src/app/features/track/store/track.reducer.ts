import {Track} from "../../../core/models/track.model";
import {createReducer, on} from "@ngrx/store";
import * as TrackActions from './track.actions';

export interface TrackState {
  tracks: Track[];
  loading: boolean;
  error: string | null;
}

const initialState: TrackState = {
  tracks: [],
  loading: false,
  error: null,
}

export const trackReducer = createReducer(
  initialState,
  on(TrackActions.loadTracksSuccess, (state, {tracks}) => ({...state, tracks})),
  on(TrackActions.loadTracksFailure, (state, {error}) => ({...state, error})),

  on(TrackActions.addTrackSuccess, (state, {track}) => ({
    ...state,
    loading: !state.loading,
    tracks: [...state.tracks, track],
  })),
  on(TrackActions.addTrackFailure, (state, {error}) => ({...state, error})),


  on(TrackActions.updateTrackSuccess, (state, {track}) => ({
    ...state,
    loading: !state.loading,
    tracks: state.tracks.map((t) => (t.id === track.id) ? track : t),
  })),
  on(TrackActions.updateTrackFailure, (state, {error}) => ({...state, error})),



  on(TrackActions.deleteTrackSuccess, (state, {id}) => ({
    ...state,
    tracks: state.tracks.filter((t) => t.id !== id),
  })),

  on(TrackActions.deleteTrackFailure, (state, {error}) => ({...state, error})),
)
