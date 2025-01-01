import { Component } from '@angular/core';
import {LibraryListComponent} from "../../components/library-list/library-list.component";
import {LibraryItemComponent} from "../../components/library-item/library-item.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-library-page',
  standalone: true,
  imports: [
    LibraryListComponent,
    LibraryItemComponent,
    RouterLink
  ],
  templateUrl: './library-page.component.html',
  styleUrl: './library-page.component.scss'
})
export class LibraryPageComponent {

}
