import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TimelineItem {
  year: string;
  role: string;
  company: string;
  bullets: string[];
  current?: boolean;
  type: 'work' | 'education';
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent {
  // ── 👉 EDIT YOUR EXPERIENCE / EDUCATION HERE 👈 ─────────────────
  // Sourced from your CV — extracted in full, newest first.
  // Add / remove / reorder items freely.
  timeline: TimelineItem[] = [
    {
      year: 'Apr 2025 – Present',
      role: 'Junior Software Developer',
      company: 'QAVI TECH',
      type: 'work',
      current: true,
      bullets: [
        'Building and maintaining a Warehouse Management System with Angular, React.Js, Node.js, Express.js, PHP (Yii2), and MySQL.',
        'Designing and integrating RESTful APIs for frontend-backend workflows.',
        'Optimizing backend modules in Yii2 for performance and scalability.',
        'Resolving production bugs and shipping enhancements in an Agile team.',
        'Integrated AWS S3, CloudFront, and CloudFlare for performance and reliability.',
      ],
    },
    {
      year: 'Nov 2024 – Mar 2025',
      role: 'MEAN Stack Software Developer Intern',
      company: 'QAVI TECH',
      type: 'work',
      bullets: [
        'Built MEAN Stack applications (MongoDB, Express.js, Angular, React.Js, Node.js) with PHP/Yii integration.',
        'Managed MongoDB and MySQL databases, optimizing for performance.',
        'Integrated AWS S3, CloudFront, and CloudFlare APIs.',
      ],
    },
    {
      year: 'Dec 2023 – Mar 2024',
      role: 'WordPress Development Intern',
      company: 'Rs Softwire',
      type: 'work',
      bullets: [
        'Built and customized WordPress sites — themes, plugins, performance tuning.',
        'Improved SEO and UX in collaboration with clients.',
      ],
    },
    {
      year: '2022 – 2026',
      role: 'BS Computer Science',
      company: 'Federal Urdu University, Karachi',
      type: 'education',
      bullets: [
        'Focus on software engineering, databases, and system design.',
      ],
    },
  ];
}
