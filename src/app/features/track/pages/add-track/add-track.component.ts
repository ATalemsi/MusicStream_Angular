import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Store } from '@ngrx/store';
import { MusicCategory, Track } from "../../../../core/models/track.model";
import * as TrackActions from "../../store/track.actions";
import {CommonModule} from "@angular/common";
import {NavbarComponent} from "../../../navbar/navbar.component";

@Component({
  selector: 'app-add-track',
  standalone: true,
  imports: [
    ReactiveFormsModule, CommonModule, NavbarComponent
  ],
  templateUrl: './add-track.component.html',
  styleUrl: './add-track.component.scss'
})
export class AddTrackComponent {
  trackForm: FormGroup;

  categories: MusicCategory[] = Object.values(MusicCategory);

  constructor(private readonly store: Store, private readonly fb: FormBuilder) {
    this.trackForm = this.fb.group({
      title: ['', Validators.required],
      artist: ['', Validators.required],
      description: [''],
      category: [MusicCategory.POP],
      audioFile: [null, Validators.required]
    });
  }

  onSubmit(): void {
    console.log(this.trackForm.value);
    if (this.trackForm.invalid) {
      alert("Please fill out all required fields");
      return;
    }

    const { title, artist, description, category, audioFile } = this.trackForm.value;
    console.log({ title, artist, description, category, audioFile });

    const track: Track = {
      id: this.generateId(),
      title,
      artist,
      description,
      addedAt: new Date(),
      duration: 0,
      category,
      fileUrl: URL.createObjectURL(audioFile)
    };

    console.log(track);
    this.store.dispatch(TrackActions.addTrack({ track, audioFile }));

    alert("Track submission initiated");

    this.resetForm();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      this.trackForm.patchValue({ audioFile: file });
    } else {
      alert("Please upload a valid audio file");
      this.trackForm.patchValue({ audioFile: null });
    }
  }

  resetForm(): void {
    this.trackForm.reset({
      category: MusicCategory.POP,
      audioFile: null
    });
  }

  private generateId(): string {
    return 'track-' + Math.random().toString(36).substr(2, 9);
  }
}
