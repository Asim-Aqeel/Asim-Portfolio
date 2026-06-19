import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ShowcaseProject {
  /** Small green label, e.g. "SENTIENT-AI" */
  label: string;
  /** Year string, e.g. "2024" */
  year: string;
  /** Card heading */
  title: string;
  /** Paragraph description */
  description: string;
  /** Tech stack chips */
  tags: string[];
  /** Screenshot path — put files in src/assets/projects/ */
  image: string;
  /** Optional — hides button if omitted */
  liveUrl?: string;
  /** Optional — hides button if omitted */
  githubUrl?: string;
}

@Component({
  selector: 'app-project-showcase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-showcase.component.html',
  styleUrls: ['./project-showcase.component.scss'],
})
export class ProjectShowcaseComponent implements AfterViewInit, OnDestroy {

  // ── 👉 EDIT YOUR PROJECTS HERE 👈 ──────────────────────────────
  // Add / remove objects freely — scroll stack auto-adjusts.
  // Screenshots go in:  src/assets/projects/filename.png
  // ───────────────────────────────────────────────────────────────
  projects: ShowcaseProject[] = [
    {
      label: 'Parcel Force',
      year: '2024',
      title: 'AI-Powered Intelligence Platform for Parcel Delivery',
      description:
        'A platform to optimize parcel delivery using OpenAi API for route optimization and real-time tracking.',
      tags: ['React.JS', 'Node.js', 'Express.js', 'MongoDB', 'Git'],
      image: 'assets/images/projectImages/project1.png',
      liveUrl: 'https://parcel-delivery-website.vercel.app',
      githubUrl: 'https://github.com/Asim-Aqeel/parcel-delivery-website',
    },
    // {
    //   label: 'XEON-CAPITAL',
    //   year: '2024',
    //   title: 'Investment Portal for Xeon Capital',
    //   description:
    //     'Modern fintech UI for investors to view fund performance, KYC status, wallet transactions, and risk score.',
    //   tags: ['Angular', 'TypeScript', 'Fintech', 'REST API'],
    //   image: 'assets/projects/xeon-capital.png',
    //   liveUrl: 'https://xeoncapital.com',
    // },
    {
      label: 'PRACIFY',
      year: '2024',
      title: 'Pracify - Online Learning & Job Portal',
      description: 'Comprehensive educational platform featuring course enrollment, instructor management, job applications, social networking, payment gateway integration, and referral earning system.',
      tags: ['PHP 8', 'MySQL', 'Bootstrap 5', 'jQuery', 'AJAX', 'PDO'],
      image: 'assets/images/projectImages/project2.png',
      liveUrl: 'http://localhost/pracifyyy/pracifyyy',
      githubUrl: 'https://github.com/Asim-Aqeel/pracify'
    },
    {
      label: 'LeadRadar v2.0',
      year: '2025',
      title: 'LeadRadar v2.0 - B2B Lead Generation Tool',
      description:
        'Chrome extension to find recruiter & HR contacts via Hunter.io API with LinkedIn auto-detection and smart email surfacing.',
      tags: ['Chrome Extension', 'TypeScript', 'Hunter.io API', 'LinkedIn'],
      image: 'assets/images/projectImages/project3.png',
      githubUrl: 'https://github.com/your-username/hr-hunter-v2',
    },
  ];

  @ViewChild('section') sectionRef!: ElementRef<HTMLElement>;
  @ViewChildren('card') cardRefs!: QueryList<ElementRef<HTMLElement>>;

  private scrollFn!: () => void;
  private resizeFn!: () => void;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    // Run outside Angular zone — no change detection on every scroll tick
    this.ngZone.runOutsideAngular(() => this.initScrollStack());
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollFn);
    window.removeEventListener('resize', this.resizeFn);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" ' +
      'width="400" height="250" viewBox="0 0 400 250"%3E' +
      '%3Crect width="400" height="250" fill="%230b1120"/%3E' +
      '%3Ctext x="50%25" y="50%25" fill="%23607a96" font-family="sans-serif" ' +
      'font-size="14" text-anchor="middle" dy=".3em"%3EAdd preview image%3C/text%3E%3C/svg%3E';
  }

  // ── Scroll stack engine ──────────────────────────────────────────
  private initScrollStack(): void {
    const section = this.sectionRef.nativeElement;
    const cards   = this.cardRefs.map(r => r.nativeElement);
    const N       = cards.length;

    // Peek strip: how many px of each buried card shows above active
    const PEEK       = 60;
    // How much each deeper card scales down per depth level
    const SCALE_STEP = 0.03;
    // Must match SCSS .project-card { height: 520px }
    const CARD_H     = 520;

    const isMobile = () => window.innerWidth < 768;

    const setHeight = () => {
      section.style.height = isMobile()
        ? 'auto'
        : `${N * window.innerHeight}px`;
    };

    // Place a card at absolute top position inside sticky viewport
    const placeCard = (
      card: HTMLElement,
      topPx: number,
      scale: number,
      opacity: number
    ) => {
      card.style.top       = `${topPx}px`;
      card.style.left      = '50%';
      card.style.transform = `translateX(-50%) scale(${scale})`;
      card.style.opacity   = String(opacity);
    };

    const resetMobile = () => {
      cards.forEach(c => {
        c.style.top = c.style.left = c.style.transform = c.style.opacity = '';
      });
    };

    const onScroll = () => {
      if (isMobile()) { resetMobile(); return; }

      const vh      = window.innerHeight;
      // Y from top of viewport where active card sits centered
      const centerY = (vh - CARD_H) / 2;

      const scrolled = -section.getBoundingClientRect().top;
      if (scrolled < 0 || scrolled >= N * vh) return;

      const raw      = scrolled / vh;
      const idx      = Math.min(Math.floor(raw), N - 1);
      const progress = raw - idx; // 0 → 1

      cards.forEach((card, i) => {
        card.style.zIndex = String(i + 1);

        if (i < idx) {
          // ── BURIED: peek above active card ─────────────────────
          const depth   = idx - i;
          const scale   = Math.max(0.85, 1 - depth * SCALE_STEP);
          const peekY   = centerY - (PEEK * depth);
          placeCard(card, peekY, scale, 1);

        } else if (i === idx) {
          // ── ACTIVE: shrinks + lifts as next card arrives ────────
          // Only start moving when progress > 0.3 for first card
          const activeProgress = (idx === 0 && progress < 0.3) ? 0 : progress;
          const scale   = 1 - (activeProgress * SCALE_STEP);
          const cardY   = centerY - (PEEK * activeProgress);
          placeCard(card, cardY, scale, 1);

        } else if (i === idx + 1) {
          // ── INCOMING: slides up from below ──────────────────────
          // Only start moving when progress > 0.3 for first card
          const incomingProgress = (idx === 0 && progress < 0.3) ? 0 : progress;
          const cardY = vh + (centerY - vh) * incomingProgress;
          placeCard(card, cardY, 1, 1);

        } else {
          // ── NOT YET: waiting below screen ───────────────────────
          placeCard(card, vh, 1, 1);
        }
      });
    };

    cards.forEach((card, i) => (card.style.zIndex = String(i + 1)));

    setHeight();
    onScroll();

    this.scrollFn = onScroll;
    this.resizeFn = () => { setHeight(); onScroll(); };

    window.addEventListener('scroll', this.scrollFn, { passive: true });
    window.addEventListener('resize', this.resizeFn);
  }
}
