import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Service {
  icon: string;
  accent: 'mint' | 'violet' | 'amber';
  title: string;
  description: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  services: Service[] = [
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#5eead4" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
      accent: 'mint',
      title: 'Frontend Development',
      description: 'Building fast, responsive, and accessible user interfaces with Angular, React, and TypeScript, combining clean component architecture with pixel-perfect, mobile-first design.'
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>',
      accent: 'violet',
      title: 'Backend & API Development',
      description: 'Designing secure, scalable REST APIs with Node.js, Express, and PHP Yii2, backed by clean architecture, JWT authentication, and database integrations built for enterprise-grade reliability.'
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#5eead4" stroke-width="2"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>',
      accent: 'mint',
      title: 'Database Architecture',
      description: 'Designing efficient schemas and optimized queries across MySQL and MongoDB, with a focus on data modeling, indexing, and migrations that keep growing applications fast and consistent.'
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf6a" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10Z"/></svg>',
      accent: 'amber',
      title: 'Cloud & AWS Integration',
      description: 'Deploying scalable cloud infrastructure using AWS S3, CloudFront, and CloudFlare, with CI/CD pipelines and performance tuning that keep applications fast, secure, and production-ready.'
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#5eead4" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
      accent: 'mint',
      title: 'WordPress Development',
      description: 'Crafting custom WordPress themes and plugins tailored to client needs, with built-in SEO best practices and Core Web Vitals optimization to keep every site fast and search-friendly.'
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
      accent: 'violet',
      title: 'UI/UX Implementation',
      description: 'Turning Figma designs into responsive, production-ready interfaces with Tailwind CSS and modern animation techniques, bridging the gap between visual design and functional code.'
    }
  ];

  constructor(private sanitizer: DomSanitizer) {}

  getSafeIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }
}
