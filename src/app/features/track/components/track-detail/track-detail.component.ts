import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription, filter, take, switchMap} from 'rxjs';
import {PlayerState, Track} from "../../../../core/models/track.model";
import {ActivatedRoute, Router, ParamMap} from "@angular/router";
import {Store} from "@ngrx/store";
import * as TrackActions from "../../../store/track.actions"
import {selectTrackById, selectAllTracks} from "../../../store/track.selectors";
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {AudioPlayerService} from "../../../../core/services/audio-player/audio-player.service";
import {TrackService} from "../../../../core/services/track/track.service";

@Component({
  selector: 'app-track-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './track-detail.component.html',
  styleUrl: './track-detail.component.scss'
})
export class TrackDetailComponent implements OnInit, OnDestroy {
  track$!: Observable<Track | undefined>;
  tracks$: Observable<Track[]>;
  currentTime: number = 0;
  duration: number = 0;
  volume: number = 1;
  showVolumeSlider: boolean = false;
  playerState: PlayerState = PlayerState.STOPPED;
  playerStateSubscription: Subscription;
  tracksSubscription?: Subscription;
  routeSubscription?: Subscription;
  imageUrlSubscription?: Subscription;
  currentImageUrl: string = '';
  readonly defaultCoverImage = 'https://res.cloudinary.com/dz4pww2qv/image/upload/v1735915190/apbake6pbviilhdi1brd.jpg';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly audioPlayer: AudioPlayerService,
    private readonly trackService: TrackService
  ) {
    this.tracks$ = this.store.select(selectAllTracks);
    this.playerStateSubscription = this.audioPlayer.playerState$.subscribe(
      (state: PlayerState) => this.playerState = state
    );
  }

  ngOnInit(): void {
    this.store.dispatch(TrackActions.loadTracks());

    this.routeSubscription = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const trackId = params.get('id');
        if (trackId) {
          this.store.dispatch(TrackActions.loadTrack({ id: trackId }));
          return this.store.select(selectTrackById(trackId));
        }
        return [];
      })
    ).subscribe(track => {
      if (track) {
        this.track$ = this.store.select(selectTrackById(track.id));
        this.loadTrackImage(track);
      }
    });

    this.tracksSubscription = this.tracks$.pipe(
      filter(tracks => tracks.length > 0),
      take(1)
    ).subscribe(tracks => {
      this.audioPlayer.loadPlaylist(tracks);

      const trackId = this.route.snapshot.paramMap.get('id');
      if (trackId) {
        const currentTrack = tracks.find(t => t.id === trackId);
        if (currentTrack && this.playerState !== PlayerState.PLAYING) {
          this.audioPlayer.play(currentTrack);
        }
      }
    });

    this.audioPlayer.currentTime$.subscribe(time => {
      this.currentTime = time;
    });
    this.audioPlayer.duration$.subscribe(duration => {
      this.duration = duration;
    });
  }

  loadTrackImage(track: Track): void {
    if (!track) return;

    if (track.imageUrl?.startsWith('blob:')) {
      this.currentImageUrl = track.imageUrl;
      return;
    }

    this.imageUrlSubscription = this.trackService.getImageFileUrl(track.id).subscribe({
      next: (url) => {
        if (url) {
          console.log('Received image URL:', url);
          this.currentImageUrl = url;
        } else {
          console.log('No image URL found, using default');
          this.currentImageUrl = this.defaultCoverImage;
        }
      },
      error: (err) => {
        console.error('Error loading image:', err);
        this.currentImageUrl = this.defaultCoverImage;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.playerStateSubscription) {
      this.playerStateSubscription.unsubscribe();
    }
    if (this.tracksSubscription) {
      this.tracksSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.imageUrlSubscription) {
      this.imageUrlSubscription.unsubscribe();
    }
    if (this.currentImageUrl && this.currentImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.currentImageUrl);
    }
  }

  async playNext(): Promise<void> {
    await this.audioPlayer.next();
    const nextTrack = this.audioPlayer.getCurrentTrack();
    if (nextTrack) {
      await this.router.navigate(['/track', nextTrack.id], {
        replaceUrl: true
      });
      this.track$ = this.store.select(selectTrackById(nextTrack.id));
    }
  }

  async playPrevious(): Promise<void> {
    await this.audioPlayer.previous();
    const prevTrack = this.audioPlayer.getCurrentTrack();
    if (prevTrack) {
      // Update the route without reloading the page
      await this.router.navigate(['/track', prevTrack.id], {
        replaceUrl: true // This prevents adding to browser history
      });
      this.track$ = this.store.select(selectTrackById(prevTrack.id));
    }
  }

  togglePlay(track: Track): void {
    if (this.playerState === PlayerState.PLAYING) {
      this.audioPlayer.pause();
    } else {
      this.audioPlayer.play(track);
    }
  }

  stopTrack(): void {
    this.audioPlayer.stop();
  }

  onVolumeChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.volume = parseFloat(value);
    this.audioPlayer.setVolume(this.volume);
  }

  toggleVolumeSlider(): void {
    this.showVolumeSlider = !this.showVolumeSlider;
  }

  formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  onProgressChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const time = (parseFloat(value) * this.duration) / 100;
    this.audioPlayer.setProgress(time);
  }

  getProgress(): number {
    return this.duration ? (this.currentTime / this.duration) * 100 : 0;
  }

  handlePlayClick(): void {
    this.track$.pipe(take(1)).subscribe(track => {
      if (track) {
        this.togglePlay(track);
      }
    });
  }
}
