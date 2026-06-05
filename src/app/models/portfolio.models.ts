export interface NavLink { id:string; label:string; hideOnMobile?:boolean; }
export interface HeroStat { value:string; suffix:string; label:string; }
export interface TechChip { label:string; colorClass:string; }
export interface WhatIDoCard { iconPath:string; title:string; desc:string; }
export interface Project { id:string; num:string; year:string; tags:string[]; title:string; desc:string; bgGradient:string; accentColor:string; github:string; demo:string; }
export interface Service { iconPath:string; title:string; desc:string; items:string[]; featured?:boolean; }
export interface TimelineItem { date:string; role:string; company:string; location?:string; tag?:string; tagColor?:string; bullets:string[]; }
export interface ContactLink { iconPath:string; label:string; value:string; href:string; }
export interface ContactForm { from_name:string; from_email:string; subject:string; timeline:string; message:string; }
