import { environment } from '../../../../../environments/environment';
import { element } from 'protractor';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError, flatMap } from "rxjs/operators";
import { Category } from "../model/category.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  user_id: string = "natalia_francisco";
  private apiPath = environment.apiUrl + "/categorias?user_id=" + this.user_id;


  constructor(private http: HttpClient) { }

  getAll(): Observable<Category[]>{
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategories)
    )
  }

  getById(id: number): Observable<Category>{
    const url = `${environment.apiUrl}/categorias/${id}?user_id=${this.user_id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    )
  }

  create(category: Category): Observable<Category>{
    category.user_id = this.user_id;
    category.id = (Math.floor(Math.random() * (5)))
    return this.http.post(this.apiPath, category).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    )
  }

  update(category: Category): Observable<Category>{
    const url = `${this.apiPath}/${category.id}`;
    category.user_id = this.user_id;
    return this.http.put(url, category).pipe(
      catchError(this.handleError),
      map(() => category)
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

  private jsonDataToCategories(jsonData: any[]): Category[]{
    const categories: Category[] = [];
    jsonData.forEach(element => categories.push(element as Category));
    return categories;
  }

  private jsonDataToCategory(jsonData: any): Category {
    return jsonData as Category;
  }
  
  private handleError(error: any): Observable<any> {
    console.log("Erro na requisição => ", error);
    return throwError(error);
  }
}
