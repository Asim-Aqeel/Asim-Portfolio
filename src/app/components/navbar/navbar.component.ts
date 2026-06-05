import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";
import { ScrollService }       from "../../shared/services/scroll.service";
import { PortfolioDataService } from "../../shared/services/portfolio-data.service";

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit, OnDestroy {
  activeSection = "hero";
  isDark = true;
  private _sub!: Subscription;

  constructor(public data: PortfolioDataService, public scroll: ScrollService) {}

  ngOnInit(): void {
    this._sub = this.scroll.activeSection$.subscribe(s => (this.activeSection = s));
    const saved = localStorage.getItem("asim-theme");
    if (saved) this._apply(saved as "dark" | "light");
  }

  ngOnDestroy(): void { this._sub.unsubscribe(); }

  toggleTheme(): void { this._apply(this.isDark ? "light" : "dark"); }

  private _apply(theme: "dark" | "light"): void {
    this.isDark = theme === "dark";
    document.documentElement.dataset["theme"] = theme;
    localStorage.setItem("asim-theme", theme);
  }
}