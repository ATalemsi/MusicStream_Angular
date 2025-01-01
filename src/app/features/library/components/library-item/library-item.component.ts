import { Component } from '@angular/core';
import {MusicCategory} from "../../../../core/models/track.model";
import {KeyValuePipe, NgForOf, TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-library-item',
  standalone: true,
  imports: [
    NgForOf,
    TitleCasePipe,
    KeyValuePipe
  ],
  templateUrl: './library-item.component.html',
  styleUrl: './library-item.component.scss'
})
export class LibraryItemComponent {
  musicCategory = MusicCategory;  // Access MusicCategory enum
  selectedCategory: MusicCategory | null = null;  // Track the selected category

  // Method to filter tracks based on selected category (you will pass this logic to the track listing component)
  filterByCategory(category: MusicCategory | null): void {
    this.selectedCategory = category;
  }

  // Method to check if the category is selected
  isSelectedCategory(category: MusicCategory): boolean {
    return this.selectedCategory === category;
  }
}
