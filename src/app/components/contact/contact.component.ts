import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortfolioDataService } from '../../shared/services/portfolio-data.service';

declare const emailjs: any;

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit, AfterViewInit {
  // EmailJS credentials
  private EJ_KEY = 'Tk7-kWUXJ8zf4op7o';
  private EJ_SVC = 'service_2g89ndg';
  private EJ_TPL = 'template_a0cky4s';
  private EJ_AUTO_REPLY_TPL = 'template_28dkyui';

  form!: FormGroup;
  sending = false;
  status  = '';
  isOk   = false;

  constructor(public data: PortfolioDataService, private fb: FormBuilder,
              @Inject(PLATFORM_ID) private pid: object) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      from_name:  ['', [Validators.required, Validators.minLength(2)]],
      from_email: ['', [Validators.required, Validators.email]],
      subject:    ['Project Inquiry'],
      timeline:   ['Flexible'],
      message:    ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.pid)) return;
    this._loadAvatar();
    if (typeof emailjs !== 'undefined')
      emailjs.init({ publicKey: this.EJ_KEY });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.sending = true; this.status = '';
    try {
      // Send email to you with form data
      await emailjs.send(this.EJ_SVC, this.EJ_TPL, this.form.value);
      console.log('Main email sent successfully');
      // Send auto-reply to user - send full form data to ensure all variables are available
      await emailjs.send(this.EJ_SVC, this.EJ_AUTO_REPLY_TPL, this.form.value);
      console.log('Auto-reply sent successfully');
      this.isOk = true;
      this.status = "✓ Message sent! I'll reply within 24 hours.";
      this.form.reset({ subject: 'Project Inquiry', timeline: 'Flexible' });
      // Clear success message after 10 seconds
      setTimeout(() => {
        this.status = '';
      }, 10000);
    } catch (error: any) {
      console.error('EmailJS Error:', error);
      this.isOk = false;
      this.status = 'email cannot send';
    }
    this.sending = false;
  }

  private _loadAvatar(): void {
    const load = (src: string, cb: () => void) => {
      const s = document.createElement('script'); s.src = src; s.onload = cb;
      document.head.appendChild(s);
    };
    load('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
      () => load('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
        () => this._initThree()));
  }

  private _initThree(): void {
    const canvas = document.getElementById('cv-canvas') as HTMLCanvasElement;
    if (!canvas || typeof (window as any).THREE === 'undefined') return;
    const THREE = (window as any).THREE;
    const wrap = canvas.parentElement!;
    let W = wrap.clientWidth || 260, H = wrap.clientHeight || 500;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.outputEncoding = THREE.sRGBEncoding;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W/H, 0.1, 100);
    camera.position.set(0, 3.0, 8.5);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const kL = new THREE.DirectionalLight(0x00f5c4, 1.1);
    kL.position.set(2, 4, 3); scene.add(kL);
    const fL = new THREE.DirectionalLight(0x4361ee, 0.55);
    fL.position.set(-3, 2, -1); scene.add(fL);
// ya charachter ka oval ha yaha sa set hogi positioning uski
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(0.85, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 })
    );
    disc.rotation.x = -Math.PI / 2; disc.position.set(0.40, 0.007, 2.1); scene.add(disc);

    let mixer: any, model: any, mouseX = 0, rotY = 0, idleT = 0;
    const clock = new THREE.Clock();

    new THREE.GLTFLoader().load('/assets/model/model.glb', (gltf: any) => {
      model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const sz  = box.getSize(new THREE.Vector3());
      const sc  = 6.0 / Math.max(sz.x, sz.y, sz.z);
      const ctr = box.getCenter(new THREE.Vector3());
      model.scale.setScalar(sc);
      model.position.set(-ctr.x*sc + 0.8, -box.min.y*sc - 0.8, -ctr.z*sc);
      model.rotation.y = 0.3;
      model.traverse((c: any) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
      scene.add(model);
      if (gltf.animations?.length) {
        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();
      }
      console.log('Model loaded successfully');
    }, undefined, (error: any) => {
      console.error('Error loading GLB model:', error);
    });

    document.addEventListener('mousemove', (e: MouseEvent) => {
      mouseX = (e.clientX / innerWidth - 0.5) * 0.55;
    }, { passive: true });

    const tick = () => {
      requestAnimationFrame(tick);
      const dt = clock.getDelta(); idleT += dt;
      if (mixer) mixer.update(dt);
      else if (model) model.position.y += Math.sin(idleT * 1.1) * 0.0008;
      rotY += (mouseX * 0.42 - rotY) * 0.045;
      if (model) model.rotation.y = rotY;
      renderer.render(scene, camera);
    };
    tick();

    new ResizeObserver(() => {
      W = wrap.clientWidth || 260; H = wrap.clientHeight || 500;
      camera.aspect = W/H; camera.updateProjectionMatrix(); renderer.setSize(W, H);
    }).observe(wrap);
  }
}
