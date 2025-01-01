import { Injectable } from '@angular/core';
import {openDB , IDBPDatabase} from "idb";
import {Track} from "../../models/track.model";

@Injectable({
  providedIn: 'root'
})
export class IndexeddbService {
  private readonly dbName = 'musicStreamDB';
  private db!: IDBPDatabase;

  constructor() { }

  async initDB() {
    this.db = await openDB(this.dbName, 1, {
      upgrade(db) {
        db.createObjectStore('tracks', { keyPath: 'id' });
        db.createObjectStore('audioFiles', { keyPath: 'id' });
      },
    });
  }

  async addTrack(track: Track , audioBlob: Blob): Promise<void> {
    await this.db.put('tracks', track);
    await this.db.put('audioFiles', {
      id: track.id,
      blob : audioBlob
      });
  }

  async getTrack(id: string): Promise<Track> {
    return this.db.get('tracks', id);
  }

  async getAllTracks(): Promise<Track[]> {
    return this.db.getAll('tracks');
  }

  async getAudioFile(id: string): Promise<Blob> {
    const file = await this.db.get('audioFiles', id);
    return file.blob;
  }
}
