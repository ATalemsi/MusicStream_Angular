import {Component, EventEmitter, Output, Input} from '@angular/core';

@Component({
  selector: 'app-volume-control',
  standalone: true,
  imports: [],
  templateUrl: './volume-control.component.html',
  styleUrl: './volume-control.component.scss'
})
export class VolumeControlComponent {
  @Input() volume = 1;
  @Output() volumeChange = new EventEmitter<number>();

  showSlider = false;

  toggleVolumeSlider(): void {
    this.showSlider = !this.showSlider;
  }

  onVolumeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.volumeChange.emit(Number(input.value));
  }
}
