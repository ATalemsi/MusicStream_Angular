import { Injectable } from '@angular/core';
import { PlayerState, Track } from "../../models/track.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private readonly audioContext: AudioContext;
  private readonly audioElement: HTMLAudioElement;
  private currentTrack: Track | null = null;
  private currentTrackIndex: number = 0;

  private readonly playerStateSubject: BehaviorSubject<PlayerState> = new BehaviorSubject<PlayerState>(PlayerState.STOPPED);
  public playerState$ = this.playerStateSubject.asObservable();

  private playlist: Track[] = [];

  constructor() {
    this.audioContext = new AudioContext();
    this.audioElement = new Audio();
  }

  loadPlaylist(tracks: Track[]): void {
    this.playlist = tracks;
    this.currentTrackIndex = 0; // Reset to the first track
    this.play(this.playlist[this.currentTrackIndex]);
  }

  play(track: Track): void {
    this.currentTrack = track;
    this.audioElement.src = track.fileUrl;


    this.playerStateSubject.next(PlayerState.PLAYING);

    this.audioElement.play().catch(error => {

      this.playerStateSubject.next(PlayerState.ERROR);
    });
  }


  pause(): void {
    this.audioElement.pause();
    this.playerStateSubject.next(PlayerState.PAUSED);
  }


  setVolume(volume: number): void {
    this.audioElement.volume = volume;
  }


  setProgress(progress: number): void {
    this.audioElement.currentTime = progress;
  }


  next(): void {
    if (!this.playlist.length) return; // No tracks in playlist


    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;


    const nextTrack = this.playlist[this.currentTrackIndex];
    this.play(nextTrack);
  }


  previous(): void {
    if (!this.playlist.length) return;


    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;


    const prevTrack = this.playlist[this.currentTrackIndex];
    this.play(prevTrack);
  }


  getPlayerState(): PlayerState {
    return this.playerStateSubject.value;
  }


  handleBuffering(): void {
    this.playerStateSubject.next(PlayerState.BUFFERING);
  }


  handleError(error: any): void {
    this.playerStateSubject.next(PlayerState.ERROR);
  }
}
