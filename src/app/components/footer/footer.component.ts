import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../../shared/services/scroll.service';
@Component({
  selector: 'app-footer', standalone: true, imports: [CommonModule],
  templateUrl: './footer.component.html', styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  year = new Date().getFullYear();
  constructor(public scroll: ScrollService) {}
}
