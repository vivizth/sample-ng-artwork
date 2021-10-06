import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { BehaviorSubject } from 'rxjs';

export interface ArtWork {
  title: string;
  artist_title: string;
  image_id: string;
  style_titles: string[];
  style_title: string;
}

export interface Pagination {
  total_pages: number;
  current_page: number;
}

export interface GetArtwork {
  pagination: Pagination;
  data: ArtWork[];
  config: {
    iiif_url: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ArtworkService {

  constructor(private http: HttpClient) {
  }

  get = (page: any) => {
    return this.http.get<GetArtwork>(`${environment.baseUrl}/artworks?page=${page}&limit=100`)
  }
}
