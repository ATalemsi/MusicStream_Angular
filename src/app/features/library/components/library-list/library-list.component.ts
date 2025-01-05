import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {PlayerState, Track} from "../../../../core/models/track.model";
import { Store } from "@ngrx/store";
import { selectAllTracks, selectTrackError } from "../../../store/track.selectors";
import * as TrackActions from "../../../store/track.actions";
import {AsyncPipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import {ClickOutsideDirective} from "../../../../shared/click-outside.directive";
import {AudioPlayerService} from "../../../../core/services/audio-player/audio-player.service";

@Component({
  selector: 'app-library-list',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    NgForOf,
    ClickOutsideDirective,
    NgOptimizedImage,

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
export class LibraryListComponent implements OnInit , OnDestroy {
  tracks$: Observable<Track[]>;
  trackError$: Observable<string | null>;
  openDropdownId: string | null = null;
  playerState: PlayerState = PlayerState.STOPPED;
  private readonly playerStateSubscription: Subscription;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly audioPlayer: AudioPlayerService
  ) {
    this.tracks$ = this.store.select(selectAllTracks);
    this.trackError$ = this.store.select(selectTrackError);
    this.playerStateSubscription = this.audioPlayer.playerState$.subscribe(
      (state: PlayerState) => this.playerState = state
    );
  }

  ngOnDestroy(): void {
    if (this.playerStateSubscription) {
      this.playerStateSubscription.unsubscribe();
    }
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
    console.log(`Navigating to edit track with ID: ${track.id}`);
    this.router.navigate(['/track/edit', track.id]).catch(err => {
      console.error('Navigation error:', err);
    });
    this.closeDropdown(track.id);
  }

  onDeleteTrack(trackId: string): void {
    if (confirm('Are you sure you want to delete this track?')) {
      this.store.dispatch(TrackActions.deleteTrack({ id: trackId }));
    }
    this.closeDropdown(trackId);
  }

  navigateToTrackDetails(track: Track): void {

    this.audioPlayer.play(track).catch(error => {
      console.error('Error playing track:', error);
    });
    this.router.navigate(['/track', track.id]).then(() => {
      console.log('Navigated to track details');
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  }
}
