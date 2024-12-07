import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-pagination',
  standalone: true,
  imports: [],
  templateUrl: './custom-pagination.component.html',
  styleUrl: './custom-pagination.component.css'
})
export class CustomPaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();


  previousPage() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }
}
