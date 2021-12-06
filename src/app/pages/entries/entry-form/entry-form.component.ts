import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Entry } from '../shared/model/entry';
import { EntryService } from '../shared/service/entry.service';
import { Category } from '../../categories/shared/model/category.model';
import { CategoryService } from './../../categories/shared/service/category.service';
import { toastr } from 'toastr';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  categories: Array<Category>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
    ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  ngAfterContentChecked(){
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;
    
    if (this.currentAction == "new")
      this.createEntry();
    else 
      this.updateEntry();

  }

  get typeOptions(): Array<any>{
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      })
  }


  //PRIVATE METHODS
  private setCurrentAction(){
    if(this.route.snapshot.url[0].path == "new")
      this.currentAction = "new"
    else
      this.currentAction = "edit"    
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null, [Validators.required]],
      type: ["expense", [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadEntry(){
    if (this.currentAction == 'edit'){
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get("id")))
      )
      .subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(this.entry) // binds loaded entry data to EntryForm
        },
        (error) => alert('Ocorreu um erro no servidor, tente novamente mais tarde')
      )
    }
  }
  
  private loadCategories(){
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
  }

  private setPageTitle(){
    if (this.currentAction == "new")
    {
      this.pageTitle = "Cadastro de Novo Lançamento"
    } else {
      const entryName = (this.entry.name || "")
      this.pageTitle = "Editando o Lançamento: " +entryName;
    }
  }


  private createEntry(){
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.create(entry)
    .subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    )
  }


  private updateEntry(){
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry)
    .subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    )
  }

  private actionsForSuccess(entry: Entry){
    toastr.success("Solicitação processada com sucesso!");

    this.router.navigateByUrl("entries",{skipLocationChange: true}).then(
      () => this.router.navigate(["entries", entry.id, "edit"])
    ) 
  }

  private actionsForError(error){
    toastr.error("Ocorreu um erro ao processar a sua solicitação!");
    this.submittingForm = false;

    if(error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde"]
  }

}

}
