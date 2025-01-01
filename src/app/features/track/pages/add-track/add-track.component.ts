import {Component} from '@angular/core';
import {MusicCategory, Track} from "../../../../core/models/track.model";
import * as TrackActions from "../../store/track.actions"
import {Store} from "@ngrx/store";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-add-track',
  standalone: true,
  imports: [
    FormsModule , CommonModule
  ],
  templateUrl: './add-track.component.html',
  styleUrl: './add-track.component.scss'
})
export class AddTrackComponent {
  title: string = '';
  artist: string = '';
  description: string = '';
  category: MusicCategory = MusicCategory.POP;
  audioFile: File | null = null;

  categories: MusicCategory[] = Object.values(MusicCategory);

  constructor(private readonly store: Store) {}

  onSubmit(): void {
    console.log('Form submitted');
    if (!this.audioFile) {
      alert("Please upload a file");
      return;
    }

    const track: Track = {
      id: this.generateId(),
      title: this.title,
      artist: this.artist,
      description: this.description,
      addedAt: new Date(),
      duration: 0,
      category: this.category,
      fileUrl: URL.createObjectURL(this.audioFile)
    };

    this.store.dispatch(TrackActions.addTrack({ track, audioFile: this.audioFile }));

    alert("Track submission initiated");

    this.resetForm();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      this.audioFile = file;
    } else {
      alert("Please upload a valid audio file");
      this.audioFile = null;
    }
  }


  resetForm(): void {
    this.title = '';
    this.artist = '';
    this.description = '';
    this.category = MusicCategory.POP;
    this.audioFile = null;
  }

  private generateId(): string {
    return 'track-' + Math.random().toString(36).substr(2, 9);
  }

}
