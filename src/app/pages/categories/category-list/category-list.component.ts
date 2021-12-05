import { CategoryService } from './../shared/service/category.service';
import { Component, OnInit } from '@angular/core';
import { Category } from '../shared/model/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories,
      error => alert('Erro ao carregar a Lista')
    )
  }

  deleteCategory(category){
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if(mustDelete){
      this.categoryService.delete(category.id).subscribe(
        () => this.categories = this.categories.filter(element => element != category),
        () => alert("erro} ao deletar categoria")
    )
      }
  }

}
