import {Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import {Track} from "../../../../core/models/track.model";
import {ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import * as TrackActions from "../../store/track.actions"
import {selectTrackById} from "../../store/track.selectors";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-track-detail',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './track-detail.component.html',
  styleUrl: './track-detail.component.scss'
})
export class TrackDetailComponent implements OnInit {
    track$!: Observable<Track | undefined>;

    constructor(private readonly route: ActivatedRoute, private readonly store: Store) {}

    ngOnInit(): void {
      const trackId = this.route.snapshot.paramMap.get('id');
      if (trackId) {

        this.store.dispatch(TrackActions.loadTrack({ id: trackId }));

        this.track$ = this.store.select(selectTrackById(trackId));
      }
    }
}
