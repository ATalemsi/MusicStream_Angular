import { Injectable } from '@angular/core';
import { Track } from '../../models/track.model';
import {from, map, mergeMap, Observable} from "rxjs";
import {DBSchema, IDBPDatabase, openDB} from "idb";


interface TrackDB extends DBSchema {
  tracks: {
    key: string;
    value: Track;
  };
  audioFiles: {
    key: string;
    value: Blob;
  };
}
@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private db: IDBPDatabase<TrackDB> | undefined;

  constructor() {
    this.initializeDB();
  }

  private async initializeDB() {
    this.db = await openDB<TrackDB>('trackDB', 1, {
      upgrade(db) {
        db.createObjectStore('tracks', { keyPath: 'id' });
        db.createObjectStore('audioFiles', { keyPath: 'id' });
      },
    });
  }

  saveTrackMetadata(track: Track): Observable<void> {
    return from(
      this.db!.put('tracks', track).then(() => {})
    );
  }

  saveAudioFile(id: string, file: Blob): Observable<void> {
    return from(this.db!.put('audioFiles', file, id)).pipe(
      map(() => {})
    );
  }
  getTrackById(id: string): Observable<Track | undefined> {
    return from(this.db!.get('tracks', id));
  }


  getAudioFile(id: string): Observable<Blob | undefined> {
    return from(this.db!.get('audioFiles', id));
  }


  addTrack(track: Track, audioFile: Blob): Observable<Track> {
    return this.saveTrackMetadata(track).pipe(
      mergeMap(() => this.saveAudioFile(track.id, audioFile)),
      map(() => track)
    );
  }

  updateTrack(updatedTrack: Track, audioFile: Blob): Observable<Track> {
    return this.saveTrackMetadata(updatedTrack).pipe(
      mergeMap(() => this.saveAudioFile(updatedTrack.id, audioFile)),
      map(() => updatedTrack)
    );
  }


  deleteTrack(id: string): Observable<void> {
    return from(
      Promise.all([
        this.db!.delete('tracks', id),
        this.db!.delete('audioFiles', id),
      ]).then(() => {}))
  }


  validateTrackMetadata(track: Track): boolean {
    if (track.title.length > 50) {
      return false;
    }
    return !(track.description && track.description.length > 200);
  }

  validateAudioFile(file: Blob): boolean {

    if (file.size > 15 * 1024 * 1024) {
      return false;
    }

    const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/ogg'];
    return allowedTypes.includes(file.type);
  }


  getAllTrackMetadata(): Observable<Track[]> {
    return from(this.db!.getAll('tracks'));
  }

  getAllAudioFiles(): Observable<Blob[]> {
    return from(this.db!.getAll('audioFiles'));
  }
}
