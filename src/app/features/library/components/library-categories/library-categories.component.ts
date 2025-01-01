import { Component } from '@angular/core';
import {MusicCategory} from "../../../../core/models/track.model";
import {KeyValuePipe, NgForOf, TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-library-categories',
  standalone: true,
  imports: [
    NgForOf,
    TitleCasePipe,
    KeyValuePipe
  ],
  templateUrl: './library-categories.component.html',
  styleUrl: './library-categories.component.scss'
})
export class LibraryCategoriesComponent {
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
