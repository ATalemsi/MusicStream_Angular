import { Injectable } from '@angular/core';
import { Track } from '../../models/track.model';
import { catchError, from, map, mergeMap, Observable, throwError } from "rxjs";
import { DBSchema, IDBPDatabase, openDB } from "idb";

// Create an interface for the audio file storage
interface AudioFileRecord {
  id: string;
  file: Blob;
}

interface TrackDB extends DBSchema {
  tracks: {
    key: string;
    value: Track;
  };
  audioFiles: {
    key: string;
    value: AudioFileRecord;
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
    try {
      this.db = await openDB<TrackDB>('trackDB', 1, {
        upgrade(db) {
          db.createObjectStore('tracks', { keyPath: 'id' });
          db.createObjectStore('audioFiles', { keyPath: 'id' });
        },
      });
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }

  saveTrackMetadata(track: Track): Observable<void> {
    if (!this.db) {
      return throwError(() => new Error('Database not initialized'));
    }
    return from(this.db.put('tracks', track).then(() => {}));
  }

  saveAudioFile(id: string, file: Blob): Observable<void> {
    if (!this.db) {
      console.error('Database not initialized');
      return throwError(() => new Error('Database not initialized'));
    }
    if (!file.type.startsWith('audio/')) {
      console.error('Invalid file type:', file.type);
      return throwError(() => new Error('Invalid file type. Must be an audio file.'));
    }
    console.log('Saving file with ID:', id);
    console.log('File details:', file);
    const audioFileRecord: AudioFileRecord = {
      id,
      file
    };
    return from(
      this.db.put('audioFiles', audioFileRecord)
    ).pipe(
      map(() => {
        console.log('File and ID saved successfully');
      }),
      catchError((error) => {
        console.error('Error saving audio file:', error);
        return throwError(() => error);
      })
    );
  }

  getTrackById(id: string): Observable<Track | undefined> {
    if (!this.db) {
      return throwError(() => new Error('Database not initialized'));
    }
    return from(this.db.get('tracks', id));
  }

  getAudioFile(id: string): Observable<Blob | undefined> {
    if (!this.db) {
      return throwError(() => new Error('Database not initialized'));
    }
    return from(this.db.get('audioFiles', id)).pipe(
      map(record => record?.file)
    );
  }

  addTrack(track: Track, audioFile: Blob): Observable<Track> {
    return new Observable<Track>((observer) => {
      this.saveTrackMetadata(track).subscribe({
        next: () => {
          console.log('Track metadata saved successfully');
          this.saveAudioFile(track.id, audioFile).subscribe({
            next: () => {
              console.log('Audio file saved successfully');
              observer.next(track);
              observer.complete();
            },
            error: (err) => {
              console.error('Error saving audio file:', err);
              observer.error(err);
            },
          });
        },
        error: (err) => {
          console.error('Error saving track metadata:', err);
          observer.error(err);
        },
      });
    });
  }

  updateTrack(updatedTrack: Track, audioFile: Blob): Observable<Track> {
    return new Observable<Track>((observer) => {

      this.saveTrackMetadata(updatedTrack).subscribe({
        next: () => {
          console.log('Track metadata updated successfully');
          this.saveAudioFile(updatedTrack.id, audioFile).subscribe({
            next: () => {
              console.log('Audio file updated successfully');
              observer.next(updatedTrack);
              observer.complete();
            },
            error: (err) => {
              console.error('Error updating audio file:', err);
              observer.error(err);
            },
          });
        },
        error: (err) => {
          console.error('Error updating track metadata:', err);
          observer.error(err);
        },
      });
    });
  }


  deleteTrack(id: string): Observable<void> {
    if (!this.db) {
      return throwError(() => new Error('Database not initialized'));
    }
    return from(
      Promise.all([
        this.db.delete('tracks', id),
        this.db.delete('audioFiles', id),
      ]).then(() => {})
    );
  }

  getAllTrackMetadata(): Observable<Track[]> {
    if (!this.db) {
      return throwError(() => new Error('Database not initialized'));
    }
    return from(this.db.getAll('tracks'));
  }

  getAllAudioFiles(): Observable<Blob[]> {
    if (!this.db) {
      return throwError(() => new Error('Database not initialized'));
    }
    return from(this.db.getAll('audioFiles')).pipe(
      map(records => records.map(record => record.file)) // Extract Blobs from AudioFileRecords
    );
  }
}
