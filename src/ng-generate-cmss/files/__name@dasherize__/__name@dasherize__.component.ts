import {Component, OnDestroy, OnInit} from '@angular/core';
import {Menu, RelationTypeModel, Usuario} from "../../models";
import {first, Subscription} from "rxjs";
import {IPaginationAndFilter} from "../../interfaces";
import {Direction} from "../../enums/direction.enum";
import {AuthService, LoadingService, RelationTypeService, UsuarioService} from "../../services";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {EActionPermission} from "../../enums";
import Swal from "sweetalert2";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-relation-type',
  templateUrl: './relation-type.component.html',
  styleUrls: ['./relation-type.component.scss']
})
export class <%= camelize(name) %>Component implements OnInit, OnDestroy {
  modalTitle = 'Menu'
  closeResult = '';
  tempMenus: Menu[] = [];
  entity: <%= capitalize(name) %>Model;
  <%= camelize(name) %>s: <%= capitalize(name) %>Model[] = [];
  selectedItemsCount: number = 0;
  form: FormGroup;
  unselected: boolean = false;
  isNewEntity: boolean = true;
  subscriptions: Subscription[] = [];
  ModalOptions: NgbModalOptions = {
    size: "lg",
    backdrop: 'static'
  }
  totalElements: number = 0;
  pagination: IPaginationAndFilter = {
    search: '',
    page: 0,
    currentPage: 1,
    size: 10,
    direction: Direction.DESC,
    orderBy: ''
  }

  constructor(
    private readonly <%= camelize(name) %>Service: <%= capitalize(name) %>Service,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public authService: AuthService,
    public loadingService: LoadingService
  ) {
    this.form = this.formBuilder.group({
      Id: [null],
      Name: ["", [Validators.required]],
      Description: [""],
    });
    this.getEntitys();
  }

  private setForm(entity: <%= capitalize(name) %>Model | null) {
    if (entity)
      this.entity = entity;
    this.form = this.formBuilder.group({
      Id: [entity?.Id || null],
      Name: [entity?.Name || "", [Validators.required]],
      Description: [entity?.Description || ""],
    });
  }

  ngOnInit(): void {
  }

  getEntitys() {
    try {
      this.loadingService.showLoading();
      const mensuSubsc = this.<%= camelize(name) %>Service.get<%= capitalize(name)%>(this.pagination).subscribe({
        next: (response: any) => {
          this. <%= camelize(name) %>s = response.Payload;
          this.totalElements = response.TotalElements;
          this.allChecked()
        },
        error: (err: HttpErrorResponse) => {
          this.loadingService.hideLoading();
          this.toastr.error(err.error?.Message || "Ha ocurrido un error, por favor inténtelo de nuevo más tarde", "Error");
        }, complete: () => {
          this.loadingService.hideLoading();
        },
      });
      this.subscriptions.push(mensuSubsc);
    } catch (error) {
      this.loadingService.hideLoading();
      this.toastr.error("Ha ocurrido un error, por favor inténtelo de nuevo más tarde", "Error");
    }
  }

  newEntity(content: any) {
    this.isNewEntity = true;
    this.setForm(null);
    this.modalService.open(content, this.ModalOptions);
  }

  private deleteEntity(entity: string, onlyOne: boolean = false) {
    try {
      const deleateSubcr = this.<%= camelize(name) %>Service.delete<%= capitalize(name) %>(entity).subscribe({
        next: (response: any) => {
          if (response?.Message) this.toastr.success(response?.Message, "Exito");
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error(err.error?.Message || "Ha ocurrido un error, por favor inténtelo de nuevo más tarde", "Error")
        },
        complete: () => {
          if (onlyOne) this.getEntitys();
        }
      });
      this.subscriptions.push(deleateSubcr);
    } catch (error) {
      this.toastr.error("Ha ocurrido un error, por favor inténtelo de nuevo más tarde", "Error");
    }
  }

  submited() {
    try {
      if (!this.form.valid) {
        this.form.markAllAsTouched()
        this.toastr.error('Verifique la información ingresada para poder continuar', 'Error');
        return;
      }
      const tempMenu = this.form.value as Menu;
      this.loadingService._inTransaction$.next(true);
      if (this.isNewEntity) {
        const agregarMenuSubcr = this.<%= camelize(name) %>Service.post<%= capitalize(name) %>(tempMenu).subscribe({
          next: (response: any) => {
            if (response?.Message) this.toastr.success(response?.Message, "Exito");
          },
          error: (err: HttpErrorResponse) => {
            this.toastr.error(err.error?.Message || "Ha ocurrido un error, por favor inténtelo de nuevo más tarde", "Error")
          },
          complete: () => {
            this.loadingService._inTransaction$.next(false);
            this.modalService.dismissAll();
            this.getEntitys();
          }
        });
        this.subscriptions.push(agregarMenuSubcr);
      } else {
        tempMenu.Id = this.entity.Id;
        const actualizarMenuSubcr = this.<%= camelize(name) %>Service.update<%= capitalize(name) %>(tempMenu).subscribe({
          next: (response: any) => {
            this.toastr.success(response?.Message, "Exito")
          },
          error: (err: HttpErrorResponse) => {
            this.toastr.error(err.error?.Message || "Ha ocurrido un error, por favor inténtelo de nuevo más tarde", "Error")
          },
          complete: () => {
            this.loadingService._inTransaction$.next(false);
            this.modalService.dismissAll();
            this.getEntitys();
          }
        });
        this.subscriptions.push(actualizarMenuSubcr);
      }
    } catch (error) {
      this.loadingService._inTransaction$.next(false);
      this.toastr.error("Ha ocurrido un error, por favor inténtelo de nuevo más tarde", "Error");
    }
  }

  editEntity(content: any, entity: <%= capitalize(name) %>Model) {
    this.isNewEntity = false;
    this.setForm(entity);
    this.modalService.open(content, this.ModalOptions);
  }

  selectAll(event: any) {
    const selected = event.target.checked;
    this. <%= camelize(name) %>s.map(i => i.Selected = selected);
    this.allChecked();
  }

  allChecked() {
    this.selectedItemsCount = this.<%= camelize(name) %>s.filter(i => i.Selected).length;
    this.unselected = !(this.selectedItemsCount != this. <%= camelize(name) %>s.length);
  }

  select(menu: <%= capitalize(name) %>Model) {
    menu.Selected = !menu.Selected;
    this.allChecked();
  }

  deleteSelected() {
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro de eliminar ${this.selectedItemsCount > 1 ? this.selectedItemsCount + ' tipos de <%= camelize(name) %>s' : 'tipo de <%= capitalize(name) %>'} ?`,
      icon: 'warning',
      showCloseButton: true,
      focusConfirm: true,
      showCancelButton: true,
      confirmButtonColor: '#4ba1ff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const selecteds = this.<%= camelize(name) %>s.filter(i => i.Selected);
        selecteds.forEach((i, index) => {

          if (!i.Id)
            return;

          if ((index + 1) === selecteds.length)
            this.deleteEntity(i.Id, true);
          else
            this.deleteEntity(i.Id, false);
        })
      }
    });
  }

  deleteItem(entity: string) {
    Swal.fire({
      title: 'Advertencia',
      text: `¿Esta seguro de eliminar este tipo de <%= capitalize(name) %>?`,
      icon: 'warning',
      showCloseButton: true,
      focusConfirm: true,
      showCancelButton: true,
      confirmButtonColor: '#4ba1ff'
    }).then((result) => {
      if (result.isConfirmed && entity) {
        this.deleteEntity(entity, true);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(x => x.unsubscribe());
    }
  }
}
