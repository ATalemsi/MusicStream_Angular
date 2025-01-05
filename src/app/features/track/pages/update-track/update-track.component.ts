import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Observable } from 'rxjs';
import { MusicCategory, Track } from '../../../../core/models/track.model';
import {ActivatedRoute, Router} from '@angular/router';
import { Store } from '@ngrx/store';
import * as TrackActions from '../../../store/track.actions';
import { selectTrackById } from '../../../store/track.selectors';
import { NavbarComponent } from '../../../navbar/navbar.component';
import { NgForOf, NgIf } from '@angular/common';


@Component({
  selector: 'app-update-track',
  standalone: true,
  imports: [
    NavbarComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './update-track.component.html',
  styleUrls: ['./update-track.component.scss']
})
export class UpdateTrackComponent implements OnInit {
  trackForm!: FormGroup;
  track$!: Observable<Track | undefined>;
  trackId!: string | null;
  categories: MusicCategory[] = Object.values(MusicCategory);
  selectedAudioFile!: File | null;
  successMessage = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.trackId = this.route.snapshot.paramMap.get('id');
    if (this.trackId) {
      this.store.dispatch(TrackActions.loadTrack({ id: this.trackId }));
      this.track$ = this.store.select(selectTrackById(this.trackId));

      this.track$.subscribe(track => {
        if (track) {
          this.initializeForm(track);
        }
      });
    }
  }

  initializeForm(track: Track): void {
    this.trackForm = this.fb.group({
      title: [track.title, [Validators.required]],
      artist: [track.artist, [Validators.required]],
      description: [track.description],
      category: [track.category, [Validators.required]],
      audioFile: [null],
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedAudioFile = input.files[0];
      this.trackForm.patchValue({ audioFile: this.selectedAudioFile.name });
    }
  }

  onSubmit(): void {
    if (this.trackForm.valid && this.selectedAudioFile) {
      const updatedTrack = { id: this.trackId, ...this.trackForm.value };
      this.store.dispatch(
        TrackActions.updateTrack({ updatedTrack: updatedTrack, audioFile: this.selectedAudioFile })
      );
      this.successMessage = 'Track updated successfully!';
      setTimeout(() => {
        this.router.navigate(['/library']).catch(err => {
          console.error('Navigation error:', err);
        });
      }, 2000);
    } else {
      console.error('Audio file is required');
    }
  }
}
