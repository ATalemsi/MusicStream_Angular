import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Track} from "../../../../core/models/track.model";
import {Store} from "@ngrx/store";
import {selectAllTracks, selectTrackError} from "../../../track/store/track.selectors";
import * as TrackActions from "../../../track/store/track.actions";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-library-list',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgForOf,
    RouterLink
  ],
  templateUrl: './library-list.component.html',
  styleUrl: './library-list.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s 0.3s', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.3s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class LibraryListComponent implements OnInit {
  tracks$: Observable<Track[]>;
  trackError$: Observable<string | null>;

  constructor(private readonly store: Store) {
    this.tracks$ = this.store.select(selectAllTracks);
    this.trackError$ = this.store.select(selectTrackError);
  }

  ngOnInit(): void {
    this.store.dispatch(TrackActions.loadTracks());
  }
}
