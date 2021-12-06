import { CategoryService } from './../../../categories/shared/service/category.service';
import { element } from 'protractor';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { Entry } from '../model/entry';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EntryService {
  
  
  user_id: string = "natalia_francisco";
  private apiPath = environment.apiUrl + "/lancamentos?user_id=" + this.user_id;

  constructor(private http: HttpClient, private categoryService:CategoryService) { }

  getAll(): Observable<Entry[]>{
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntries)
    )
  }

  getById(id: number): Observable<Entry>{
    const url = `${this.apiPath}/lancamentos/${id}?user_id=${this.user_id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry)
    )
  }

  create(entry: Entry): Observable<Entry>{
    entry.user_id = this.user_id;
    entry.id = (Math.floor(Math.random() * (5)))
   return  this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return this.http.post(this.apiPath, entry).pipe(
          catchError(this.handleError),
          map(this.jsonDataToEntry)
        )
      })
    )
  
  }

  update(entry: Entry): Observable<Entry>{
    const url = `${this.apiPath}/${entry.id}`;
    return this.http.put(url, entry).pipe(
      catchError(this.handleError),
      map(() => entry)
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/$(id)`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  //PRIVATE METHODS

  private jsonDataToEntries(jsonData: any[]): Entry[]{
    const entries: Entry[] = [];

    jsonData.forEach(element => {
      const entry = Object.assign(new Entry(), element);
      entries.push(entry);
    });

    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }
  
  private handleError(error: any): Observable<any> {
    console.log("Erro na requisição => ", error);
    return throwError(error);
  }
}