import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Track } from "../../../../core/models/track.model";
import { Store } from "@ngrx/store";
import { selectAllTracks, selectTrackError } from "../../../track/store/track.selectors";
import * as TrackActions from "../../../track/store/track.actions";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import {ClickOutsideDirective} from "../../../../shared/click-outside.directive";

@Component({
  selector: 'app-library-list',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgForOf,
    ClickOutsideDirective,
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
  openDropdownId: string | null = null;

  constructor(
    private readonly store: Store,
    private readonly router: Router
  ) {
    this.tracks$ = this.store.select(selectAllTracks);
    this.trackError$ = this.store.select(selectTrackError);
  }

  ngOnInit(): void {
    this.tracks$.subscribe((tracks) => {
      if (!tracks || tracks.length === 0) {
        this.store.dispatch(TrackActions.loadTracks());
      }
    });
  }

  toggleDropdown(trackId: string): void {
    this.openDropdownId = this.openDropdownId === trackId ? null : trackId;
  }

  closeDropdown(trackId: string): void {
    if (this.openDropdownId === trackId) {
      this.openDropdownId = null;
    }
  }

  onUpdateTrack(track: Track): void {

    this.router.navigate(['/track/edit', track.id]);
    this.closeDropdown(track.id);
  }

  onDeleteTrack(trackId: string): void {
    if (confirm('Are you sure you want to delete this track?')) {
      this.store.dispatch(TrackActions.deleteTrack({ id: trackId }));
    }
    this.closeDropdown(trackId);
  }
}
