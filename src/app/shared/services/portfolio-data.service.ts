import { Injectable } from '@angular/core';
import { NavLink, HeroStat, TechChip, WhatIDoCard, Project, Service, TimelineItem, ContactLink } from '../../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioDataService {

  readonly navLinks: NavLink[] = [
    { id:'hero', label:'Home' }, { id:'about', label:'About' },
    { id:'services', label:'Services' }, { id:'projects', label:'Projects' },
    { id:'experience', label:'Experience', hideOnMobile:true },
    { id:'cv', label:'CV' }, { id:'contact', label:'Contact' },
  ];

  readonly typewriterPhrases = [
    'Full Stack Software & Web Developer','Angular Specialist','MEAN Stack Developer','Problem Solver','API Architect, WMS Expert'
  ];

  readonly heroStats: HeroStat[] = [
    { value:'2', suffix:'+', label:'Year Exp.' },
    { value:'5', suffix:'+', label:'Projects'  },
    { value:'3', suffix:'',  label:'Companies' },
    { value:'MEAN', suffix:'', label:'Stack'   },
  ];

  readonly techChips: TechChip[] = [
    { label:'Angular 18', colorClass:'ch-ng' }, { label:'TypeScript', colorClass:'ch-ts' },
    { label:'Node.js',    colorClass:'ch-nd' }, { label:'PHP / Yii2', colorClass:'ch-php' },
    { label:'MySQL',      colorClass:'ch-my' }, { label:'MongoDB',    colorClass:'ch-mg' },
    { label:'AWS S3',     colorClass:'ch-aws'}, { label:'React.js',   colorClass:'ch-re' },
    { label:'Tailwind',   colorClass:'ch-tw' }, { label:'Docker',     colorClass:'ch-dk' },
    { label:'RxJS',       colorClass:'ch-rx' }, { label:'WordPress',  colorClass:'ch-wp' },
    { label:'Git',        colorClass:'ch-gi' },
  ];

  readonly whatIDo: WhatIDoCard[] = [
    { iconPath:'M8 6l4-4 4 4M6 10h12M6 14h12M6 18h12', title:'Frontend Development', desc:'Angular 18, RxJS, NgRx, reactive forms, AG Grid & pixel-perfect UIs' },
    { iconPath:'M5 12h14M12 5l7 7-7 7', title:'Backend & APIs', desc:'Node.js, Express.js, PHP/Yii2, RESTful APIs & JWT authentication' },
    { iconPath:'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z', title:'Cloud & DevOps', desc:'AWS S3, CloudFront, CloudFlare APIs, Docker & CI/CD pipelines' },
    { iconPath:'M4 7h16M4 12h16M4 17h7', title:'Database Design', desc:'MySQL, MongoDB, schema design, indexing & query optimization' },
  ];

  readonly projects: Project[] = [
    { id:'pw0', num:'01', year:'QAVI TECH · 2025', tags:['Angular 18','Node.js','PHP/Yii2','MySQL','AWS S3'], title:'WMS — Warehouse Management System', desc:'Enterprise WMS at QAVI TECH. Angular UI, Node.js & PHP/Yii2 APIs, MySQL — AWS S3 + CloudFront integration for scalable file storage and CDN delivery.', bgGradient:'linear-gradient(135deg,#051a10,#0a2c1a,#062014)', accentColor:'rgba(0,245,196,.13)', github:'#', demo:'#' },
    { id:'pw1', num:'02', year:'Personal Project · 2024', tags:['Angular','D3.js','Node.js','MySQL','RxJS'], title:'Analytics Dashboard — BI Platform', desc:'Real-time BI dashboard with D3.js charts, live KPIs, date filters and RBAC. Angular 18 + RxJS data streams with CSV/PDF export.', bgGradient:'linear-gradient(135deg,#080a2a,#10143a,#0c1030)', accentColor:'rgba(67,97,238,.15)', github:'#', demo:'#' },
    { id:'pw2', num:'03', year:'MEAN Stack · 2024', tags:['Angular','Express.js','MongoDB','Stripe','JWT'], title:'E-Commerce Platform — Full Stack', desc:'End-to-end e-commerce with Stripe payments, order tracking and admin panel. MEAN stack with JWT auth, RBAC & MongoDB aggregation.', bgGradient:'linear-gradient(135deg,#051205,#0a2008,#061808)', accentColor:'rgba(71,162,72,.14)', github:'#', demo:'#' },
    { id:'pw3', num:'04', year:'Rs Softwire · 2023', tags:['WordPress','PHP','SEO','Tailwind'], title:'WordPress Sites — Client Portfolio', desc:'Custom WordPress websites with hand-crafted themes, plugin dev and SEO. 90+ Lighthouse scores and Core Web Vitals improvements.', bgGradient:'linear-gradient(135deg,#180525,#2c1050,#1a0830)', accentColor:'rgba(183,23,140,.14)', github:'#', demo:'#' },
    { id:'pw4', num:'05', year:'API Project · 2024', tags:['Node.js','Express','MongoDB','Redis','JWT'], title:'RESTful API Suite — Microservices', desc:'Production REST API — JWT/OAuth2, CRUD, AWS S3 uploads, Redis caching, rate limiting and full Postman documentation.', bgGradient:'linear-gradient(135deg,#180c00,#3a1e00,#4e2800)', accentColor:'rgba(255,153,0,.13)', github:'#', demo:'#' },
  ];

  readonly services: Service[] = [
    { featured:true, iconPath:'M16 18 22 12 16 6M8 6 2 12 8 18', title:'Angular Development', desc:'Enterprise SPAs with RxJS, NgRx, lazy loading, AG Grid and pixel-perfect UIs.', items:['Angular 18 + TypeScript','RxJS & NgRx State','Reactive & Template Forms','AG Grid Integration'] },
    { iconPath:'M5 12h14M12 5l7 7-7 7', title:'Backend & API Development', desc:'Scalable REST APIs with Node.js/Express and PHP Yii2 for enterprise backends.', items:['Node.js / Express.js','PHP (Yii2 Framework)','RESTful API Design','JWT / OAuth 2.0'] },
    { iconPath:'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', title:'Database Architecture', desc:'Schema design, query optimization and modeling for SQL and NoSQL databases.', items:['MySQL & Query Optimization','MongoDB / Mongoose','WMS Data Workflows','Database Migrations'] },
    { iconPath:'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z', title:'Cloud & AWS Integration', desc:'AWS S3, CloudFront and CloudFlare APIs for scalable, secure cloud infrastructure.', items:['AWS S3 Buckets','CloudFront CDN','CloudFlare APIs','Performance & Security'] },
    { iconPath:'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9', title:'WordPress Development', desc:'Custom themes, plugin integration and SEO optimization for client websites.', items:['Theme Development','Plugin Integration','Performance Optimization','SEO & Core Web Vitals'] },
    { iconPath:'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z', title:'UI/UX Implementation', desc:'Converting Figma designs into responsive production interfaces with modern CSS.', items:['Figma → Angular/React','Tailwind / MUI / Bootstrap','Responsive Design','CSS Animations'] },
  ];

  readonly timeline: TimelineItem[] = [
    { date:'Apr 2025 — Present', role:'Junior Software Developer', company:'QAVI TECH', location:'Karachi', tag:'Current', tagColor:'accent', bullets:['Developing & maintaining enterprise WMS using Angular, Node.js, Express.js, PHP (Yii2) and MySQL','Designing RESTful APIs for dynamic frontend–backend communication','Integrated AWS S3, CloudFront & CloudFlare APIs for performance and reliability','Collaborating in Agile sprints with senior devs and cross-functional teams'] },
    { date:'Nov 2024 — Mar 2025', role:'MEAN Stack Developer Intern', company:'QAVI TECH', location:'Karachi', tag:'Intern', tagColor:'accent', bullets:['Developed MEAN Stack apps with REST API integration','Managed MongoDB & MySQL databases, optimized performance','Built Angular UI components ensuring seamless user experience'] },
    { date:'Dec 2023 — Mar 2024', role:'WordPress Development Intern', company:'Rs Softwire', location:'Karachi', tag:'Intern', tagColor:'accent', bullets:['Developed & customized WordPress sites — theme development & performance optimization','Enhanced SEO, speed and UX for responsive, secure client websites'] },
    { date:'2022 — 2026', role:'BS Computer Science', company:'Federal Urdu University (FUUAST)', location:'Karachi', tag:'Education', tagColor:'blue', bullets:[] },
  ];
}
