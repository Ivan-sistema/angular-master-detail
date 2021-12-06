import { EntryService } from './../shared/service/entry.service';
import { Component, OnInit } from '@angular/core';
import { Entry } from '../shared/model/entry';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];

  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.entryService.getAll().subscribe(
      entries => this.entries = entries.sort((a,b) => b.id - a.id),
      error => alert('Erro ao carregar a Lista')
    )
  }

  deleteEntry(entry){
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if(mustDelete){
      this.entryService.delete(entry.id).subscribe(
        () => this.entries = this.entries.filter(element => element != entry),
        () => alert("erro} ao deletar categoria")
    )
      }
  }
}
