import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'star-field',
  standalone: true,
  imports: [],
  templateUrl: './star-field.component.html',
  styleUrl: './star-field.component.css'
})
export class StarFieldComponent implements OnInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;
  
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationId!: number;
  
  // Star layers for parallax effect
  private stars: THREE.Points[] = [];
  private starMaterials: THREE.ShaderMaterial[] = [];
  
  // Shooting stars
  private shootingStars: THREE.Mesh[] = [];
  private shootingStarTrail: THREE.Line[] = [];
  
  // Galaxy spiral
  private galaxy!: THREE.Points;
  
  // Mouse interaction
  private mouseX = 0;
  private mouseY = 0;
  private targetRotationX = 0;
  private targetRotationY = 0;
  
  ngOnInit(): void {
    this.initThreeJS();
    this.createStarLayers();
    this.createGalaxy();
    this.createShootingStars();
    this.animate();
    this.addEventListeners();
  }
  
  ngOnDestroy(): void {
    this.cleanup();
  }
  
  private initThreeJS(): void {
    const container = this.canvasContainer.nativeElement;
    
    // Scene
    this.scene = new THREE.Scene();
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.z = 500;
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    container.appendChild(this.renderer.domElement);
  }
  
  private createStarLayers(): void {
    // Create 3 layers of stars for parallax depth
    const layerConfigs = [
      { count: 800, size: 2, depth: 1000, speed: 0.0001, opacity: 0.8 },  // Background
      { count: 500, size: 3, depth: 600, speed: 0.0002, opacity: 0.9 },   // Midground
      { count: 300, size: 4, depth: 300, speed: 0.0003, opacity: 1.0 }    // Foreground
    ];
    
    layerConfigs.forEach((config, index) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(config.count * 3);
      const sizes = new Float32Array(config.count);
      const opacities = new Float32Array(config.count);
      const twinklePhases = new Float32Array(config.count);
      
      for (let i = 0; i < config.count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * config.depth * 2;
        positions[i3 + 1] = (Math.random() - 0.5) * config.depth * 2;
        positions[i3 + 2] = (Math.random() - 0.5) * config.depth * 2;
        
        sizes[i] = config.size * (0.5 + Math.random() * 0.5);
        opacities[i] = config.opacity * (0.5 + Math.random() * 0.5);
        twinklePhases[i] = Math.random() * Math.PI * 2;
      }
      
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
      geometry.setAttribute('twinklePhase', new THREE.BufferAttribute(twinklePhases, 1));
      
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pixelRatio: { value: this.renderer.getPixelRatio() }
        },
        vertexShader: `
          attribute float size;
          attribute float opacity;
          attribute float twinklePhase;
          varying float vOpacity;
          varying float vTwinkle;
          uniform float time;
          uniform float pixelRatio;
          
          void main() {
            vOpacity = opacity;
            vTwinkle = sin(time * 2.0 + twinklePhase) * 0.5 + 0.5;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying float vOpacity;
          varying float vTwinkle;
          
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = (1.0 - dist * 2.0) * vOpacity * (0.7 + vTwinkle * 0.3);
            vec3 color = vec3(1.0, 1.0, 1.0);
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      
      this.starMaterials.push(material);
      const points = new THREE.Points(geometry, material);
      points.userData = { speed: config.speed, depth: config.depth };
      this.stars.push(points);
      this.scene.add(points);
    });
  }
  
  private createGalaxy(): void {
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const arms = 5;
    const armSpread = 0.5;
    const radius = 400;
    const spinFactor = 0.8;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Spiral galaxy math
      const radius = Math.random() * 300 + 50;
      const spinAngle = radius * spinFactor;
      const branchAngle = (i % arms) * ((2 * Math.PI) / arms);
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * armSpread * radius;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * armSpread * radius;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * armSpread * radius * 0.5;
      
      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY * 0.3;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
      
      // Color gradient from center to edge
      const color = new THREE.Color();
      const mixedColor = color.lerpColors(
        new THREE.Color('#ff6b6b'),
        new THREE.Color('#4ecdc4'),
        radius / 350
      );
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
      
      sizes[i] = Math.random() * 2 + 1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: this.renderer.getPixelRatio() }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        uniform float pixelRatio;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = (1.0 - dist * 2.0) * 0.6;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    
    this.galaxy = new THREE.Points(geometry, material);
    this.galaxy.rotation.x = Math.PI * 0.3;
    this.scene.add(this.galaxy);
  }
  
  private createShootingStars(): void {
    // Create pool of shooting stars
    for (let i = 0; i < 5; i++) {
      this.createShootingStar();
    }
  }
  
  private createShootingStar(): void {
    const geometry = new THREE.SphereGeometry(2, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0
    }) as THREE.MeshBasicMaterial;
    
    const star = new THREE.Mesh(geometry, material);
    star.userData = {
      active: false,
      speed: 0,
      direction: new THREE.Vector3(),
      trail: []
    };
    
    this.shootingStars.push(star);
    this.scene.add(star);
  }
  
  private activateShootingStar(): void {
    const inactiveStars = this.shootingStars.filter(s => !s.userData.active);
    if (inactiveStars.length === 0) return;
    
    const star = inactiveStars[Math.floor(Math.random() * inactiveStars.length)];
    
    // Random starting position
    const angle = Math.random() * Math.PI * 2;
    const radius = 400;
    star.position.set(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 300,
      Math.sin(angle) * radius
    );
    
    // Diagonal direction
    star.userData.direction = new THREE.Vector3(
      -Math.cos(angle) + (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.3,
      -Math.sin(angle) + (Math.random() - 0.5) * 0.5
    ).normalize();
    
    star.userData.speed = 8 + Math.random() * 4;
    star.userData.active = true;
    (star.material as THREE.MeshBasicMaterial).opacity = 1;
    star.userData.trail = [];
  }
  
  private updateShootingStars(): void {
    this.shootingStars.forEach(star => {
      if (!star.userData.active) {
        // Random chance to activate
        if (Math.random() < 0.002) {
          this.activateShootingStar();
        }
        return;
      }
      
      // Move star
      star.position.add(star.userData.direction.clone().multiplyScalar(star.userData.speed));
      
      // Fade out after traveling
      const distance = star.position.length();
      if (distance > 600) {
        star.userData.active = false;
        (star.material as THREE.MeshBasicMaterial).opacity = 0;
      }
    });
  }
  
  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const time = performance.now() * 0.001;
    
    // Update star materials with time for twinkling
    this.starMaterials.forEach(material => {
      material.uniforms.time.value = time;
    });
    
    // Update galaxy
    if (this.galaxy) {
      this.galaxy.rotation.y += 0.0002;
      (this.galaxy.material as THREE.ShaderMaterial).uniforms.time.value = time;
    }
    
    // Rotate star layers for parallax effect
    this.stars.forEach((stars, index) => {
      const speed = stars.userData.speed;
      stars.rotation.y += speed;
      stars.rotation.x += speed * 0.5;
    });
    
    // Mouse parallax
    this.targetRotationX = this.mouseY * 0.0001;
    this.targetRotationY = this.mouseX * 0.0001;
    
    this.scene.rotation.x += (this.targetRotationX - this.scene.rotation.x) * 0.05;
    this.scene.rotation.y += (this.targetRotationY - this.scene.rotation.y) * 0.05;
    
    // Update shooting stars
    this.updateShootingStars();
    
    this.renderer.render(this.scene, this.camera);
  }
  
  private addEventListeners(): void {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
  }
  
  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (this.galaxy) {
      (this.galaxy.material as THREE.ShaderMaterial).uniforms.pixelRatio.value = this.renderer.getPixelRatio();
    }
    this.starMaterials.forEach(material => {
      material.uniforms.pixelRatio.value = this.renderer.getPixelRatio();
    });
  }
  
  private onMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX - window.innerWidth / 2;
    this.mouseY = event.clientY - window.innerHeight / 2;
  }
  
  private cleanup(): void {
    cancelAnimationFrame(this.animationId);
    
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    
    this.stars.forEach(stars => {
      stars.geometry.dispose();
      if (stars.material instanceof THREE.ShaderMaterial) {
        stars.material.dispose();
      }
    });
    
    if (this.galaxy) {
      this.galaxy.geometry.dispose();
      if (this.galaxy.material instanceof THREE.ShaderMaterial) {
        this.galaxy.material.dispose();
      }
    }
    
    this.shootingStars.forEach(star => {
      star.geometry.dispose();
      (star.material as THREE.MeshBasicMaterial).dispose();
    });
    
    this.renderer.dispose();
  }
}
