import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../../shared/services/portfolio-data.service';
import { ScrollService } from '../../shared/services/scroll.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  constructor(
    public data:   PortfolioDataService,
    public scroll: ScrollService,
  ) {}
}
