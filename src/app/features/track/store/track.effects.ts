import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {TrackService} from "../../../core/services/track/track.service";
import * as TrackActions from './track.actions';
import {mergeMap, map, catchError, of} from "rxjs";


@Injectable()
export class TrackEffects {
  constructor(private readonly action$: Actions, private readonly trackService: TrackService) {
  }

  loadTracks$ = createEffect(() =>
    this.action$.pipe(
      ofType(TrackActions.loadTracks),
      mergeMap(() =>
        this.trackService.getAllTrackMetadata().pipe(
          map((tracks) => TrackActions.loadTracksSuccess({ tracks })),
          catchError(error => of(TrackActions.loadTracksFailure({ error })))
        )
      )
    )
  );

  loadTrack$ = createEffect(() =>
    this.action$.pipe(
      ofType(TrackActions.loadTrack),
      mergeMap(({ id }) =>
        this.trackService.getTrackById(id).pipe(
          map((track) => {
            if (!track) {
              return TrackActions.loadTrackFailure({ error: 'Track not found' });
            }
            return TrackActions.loadTrackSuccess({ track });
          }),
          catchError((error) => of(TrackActions.loadTrackFailure({ error })))
        )
      )
    )
  );


  addTrack$ = createEffect(() =>
    this.action$.pipe(
      ofType(TrackActions.addTrack),
      mergeMap(({ track, audioFile }) =>
        this.trackService.addTrack(track, audioFile).pipe(
          map((newTrack) => TrackActions.addTrackSuccess({ track: newTrack })),
          catchError(error => of(TrackActions.addTrackFailure({ error })))
        )
      )
    )
  );
}
