import { Component, OnInit } from '@angular/core';
import { ArtworkService, GetArtwork } from './service/artwork.service';
import { map, share, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, Subject, zip } from 'rxjs';
import { LoadingService } from './loading.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { createPaginationList } from './util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'artwork';

  form = new FormGroup({
    filter: new FormArray([]),
    sort: new FormControl(null),
  });

  filterList: any = [];

  toView = (data: GetArtwork) => {
    const baseImg = data?.config?.iiif_url;
    return data.data.map(d => {
      return {
        title: d?.title,
        artist: d?.artist_title,
        img: `${baseImg}/${d?.image_id}/full/200,/0/default.jpg`,
        style: d?.style_titles.join(' , ')
      }
    });
  }

  toPagination = (data: GetArtwork) => {
    const thisPage = data.pagination.current_page;
    const totalPage = 51;
    const p: any[] = [];

    for(let num = thisPage - 9; num < thisPage ; num++) {
      if(num <= 0) { continue; }
      p.push({ number: num,active: num == thisPage });
    }
    for(let num = thisPage; num < thisPage + 9 ; num++) {
      if(num >= totalPage) { continue; }
      p.push({ number: num, active: num == thisPage });
    }
    if(thisPage >= 11){
      p.unshift(null);
      p.unshift({ number: 1} );
    }
    if(thisPage <= totalPage){
      p.push(null);
      p.push({ number: totalPage, active: thisPage == totalPage} );
    }
    return p;
  }

  getFilterList = (data: GetArtwork) => {
    const filter = new Map();
    this.ff.clear();
    this.filterList = [];

    data.data.forEach(d => {
      d.style_titles.forEach(style => {
        const count = filter.get(style) || 0;
        filter.set(style, count + 1 );
      });
    });

    filter.forEach((count, key) => {
      this.ff.push(new FormControl());
      this.filterList.push({count, key});
    })
  }

  page$ = new BehaviorSubject(1);

  fetch$ = this.page$.pipe(switchMap(this.artwork.get), share());

  filterChanged$ = new BehaviorSubject([]);

  artworks$ = combineLatest([this.fetch$, this.filterChanged$]).pipe(
    map(([data, filters]: [data: GetArtwork, filters: string[] ]) => {
      const test = {...data};
      if(filters && filters.length) {
        test.data = data.data.filter(x => {
          const is = x.style_titles.filter(m => {
            return filters.includes(m);
          });
          return is.length > 0;
        })
      }
      return test;
    }),
    map(this.toView)
  )

  pagination$ = this.fetch$.pipe(map(d => createPaginationList(d.pagination.current_page)));

  constructor(private artwork: ArtworkService, public loading: LoadingService) {
    this.ff.valueChanges.subscribe(d => {
      let x: any = [];
      d.forEach((v: any, i: any) => {
        if(v) {
          x.push(this.filterList[i].key)
        }
      });
      this.filterChanged$.next(x);
    });
  }
  
  ngOnInit(): void {
    this.fetch$.subscribe(this.getFilterList);
  }

  trackByFn(index: number) {
    return index;
  }

  goTo(page?: any) {
    if(page) {
      this.page$.next(page);
    }
  }

  get ff(): FormArray {
    return this.form.get('filter') as FormArray;
  }
}
