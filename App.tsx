import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    THREE: any;
    gsap: any;
  }
}

type SceneType = 'hero' | 'work' | 'about' | 'contact';

const workItems = [
  {
    title: 'Obsidian Commerce',
    summary: 'A luxury storefront with layered depth, cinematic transitions, and conversion-focused interactions.',
  },
  {
    title: 'Astra Founder OS',
    summary: 'Decision intelligence workspace with motion-guided navigation and calm visual hierarchy.',
  },
  {
    title: 'Noir Agency Site',
    summary: 'Brand-forward, performance-first marketing platform with unique identity systems.',
  },
];

function useThreeSection(ref: React.MutableRefObject<HTMLDivElement | null>, type: SceneType) {
  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE || !ref.current) return;

    const mount = ref.current;
    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 340;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9);

    const ambient = new THREE.AmbientLight('#99aaff', 0.6);
    const point = new THREE.PointLight('#88e0ff', 1.1);
    point.position.set(4, 5, 6);
    const rim = new THREE.PointLight('#d59fff', 0.9);
    rim.position.set(-6, -3, -2);
    scene.add(ambient, point, rim);

    const group = new THREE.Group();
    scene.add(group);

    const disposers: Array<() => void> = [];

    if (type === 'hero') {
      const geo = new THREE.IcosahedronGeometry(2.2, 5);
      const mat = new THREE.MeshStandardMaterial({ color: '#79a4ff', metalness: 0.45, roughness: 0.2, wireframe: true });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
      const haloGeo = new THREE.TorusGeometry(3.2, 0.05, 18, 140);
      const haloMat = new THREE.MeshBasicMaterial({ color: '#bc9aff', transparent: true, opacity: 0.8 });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = 1.2;
      group.add(halo);
      disposers.push(() => {
        geo.dispose();
        mat.dispose();
        haloGeo.dispose();
        haloMat.dispose();
      });
    }

    if (type === 'work') {
      for (let i = 0; i < 40; i += 1) {
        const geo = new THREE.BoxGeometry(0.16, 0.7 + Math.random() * 3, 0.16);
        const mat = new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? '#76c4ff' : '#d39dff',
          emissive: i % 2 === 0 ? '#2a4a74' : '#4b2e66',
          metalness: 0.2,
          roughness: 0.55,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 4);
        group.add(mesh);
        disposers.push(() => {
          geo.dispose();
          mat.dispose();
        });
      }
    }

    if (type === 'about') {
      for (let i = 0; i < 3; i += 1) {
        const geo = new THREE.TorusKnotGeometry(1.2 + i * 0.42, 0.06, 150, 22);
        const mat = new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? '#9ab0ff' : '#cfa6ff',
          wireframe: true,
          transparent: true,
          opacity: 0.75,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.set(i * 0.7, i * 0.5, i * 0.22);
        group.add(mesh);
        disposers.push(() => {
          geo.dispose();
          mat.dispose();
        });
      }
    }

    if (type === 'contact') {
      const planeGeo = new THREE.PlaneGeometry(7, 7, 70, 70);
      const planeMat = new THREE.MeshStandardMaterial({
        color: '#6f99ff',
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      });
      const plane = new THREE.Mesh(planeGeo, planeMat);
      plane.rotation.x = -1.08;
      plane.position.y = -1.4;
      group.add(plane);
      disposers.push(() => {
        planeGeo.dispose();
        planeMat.dispose();
      });
    }

    let raf = 0;
    const pointer = { x: 0, y: 0 };

    const animate = () => {
      group.rotation.y += 0.003 + pointer.x * 0.008;
      group.rotation.x += 0.0015 + pointer.y * 0.005;
      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(animate);
    };
    animate();

    const onMove = (x: number, y: number) => {
      pointer.x = x / window.innerWidth - 0.5;
      pointer.y = y / window.innerHeight - 0.5;
    };

    const mouseHandler = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const touchHandler = (e: TouchEvent) => {
      if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const resizeHandler = () => {
      const w = mount.clientWidth || 500;
      const h = mount.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    };

    window.addEventListener('mousemove', mouseHandler, { passive: true });
    window.addEventListener('touchmove', touchHandler, { passive: true });
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', mouseHandler);
      window.removeEventListener('touchmove', touchHandler);
      window.removeEventListener('resize', resizeHandler);
      disposers.forEach((dispose) => dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [ref, type]);
}

const App: React.FC = () => {
  const appRef = useRef<HTMLDivElement | null>(null);
  const heroCanvasRef = useRef<HTMLDivElement | null>(null);
  const workCanvasRef = useRef<HTMLDivElement | null>(null);
  const aboutCanvasRef = useRef<HTMLDivElement | null>(null);
  const contactCanvasRef = useRef<HTMLDivElement | null>(null);

  useThreeSection(heroCanvasRef, 'hero');
  useThreeSection(workCanvasRef, 'work');
  useThreeSection(aboutCanvasRef, 'about');
  useThreeSection(contactCanvasRef, 'contact');

  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap || !appRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.nav-item', { y: -16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'power3.out' });
      gsap.fromTo('.hero-item', { y: 36, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power3.out' });
    }, appRef);

    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal-on-scroll'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              entry.target,
              { y: 40, opacity: 0, scale: 0.98 },
              { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' },
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    elements.forEach((el) => observer.observe(el));

    gsap.to('.float-loop', { y: -10, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.18 });

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={appRef} className="min-h-screen bg-[#030303] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(123,116,255,0.22),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(88,197,255,0.18),transparent_38%),linear-gradient(to_bottom,#060606,#030303)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-300">Alif Studio</p>
          <nav className="flex flex-wrap gap-2">
            <a href="#home" className="nav-item rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.15em] hover:bg-white/10">Home</a>
            <a href="#work" className="nav-item rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.15em] hover:bg-white/10">Work</a>
            <a href="#about" className="nav-item rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.15em] hover:bg-white/10">About</a>
            <a href="#contact" className="nav-item rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.15em] hover:bg-white/10">Contact</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
        <section id="home" className="grid min-h-[92vh] items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="hero-item rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-md sm:p-10">
            <p className="text-xs uppercase tracking-[0.34em] text-violet-200/80">Mind-blowing. Original. Black Theme.</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-6xl">Now it scrolls, and 3D + GSAP are truly everywhere.</h1>
            <p className="mt-5 max-w-xl text-sm text-zinc-300 sm:text-base">
              This is a professional long-form portfolio experience with dedicated sections, smooth reveal choreography, animated depth, and interactive 3D objects that react to touch and mouse.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#work" className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm hover:bg-white/20">Explore Work</a>
              <a href="#contact" className="rounded-full border border-violet-300/40 px-5 py-3 text-sm text-violet-100 hover:bg-violet-400/20">Let&apos;s Build</a>
            </div>
          </article>
          <article className="hero-item rounded-3xl border border-cyan-300/20 bg-black/35 p-4 sm:p-6">
            <div ref={heroCanvasRef} className="float-loop h-[320px] w-full rounded-2xl bg-black/45 sm:h-[430px]" />
            <p className="mt-4 text-sm text-zinc-300">Hero 3D form with real-time interaction and continuous motion.</p>
          </article>
        </section>

        <section id="work" className="reveal-on-scroll grid min-h-[90vh] items-center gap-8 py-20 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl border border-white/10 bg-black/35 p-6 sm:p-8">
            <h2 className="text-3xl font-semibold sm:text-5xl">Selected Work</h2>
            <p className="mt-3 text-sm text-zinc-300">Premium digital products engineered with design leadership and motion precision.</p>
            <div className="mt-6 space-y-4">
              {workItems.map((item) => (
                <div key={item.title} className="float-loop rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <h3 className="text-xl font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm text-zinc-300">{item.summary}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="rounded-3xl border border-cyan-300/20 bg-black/30 p-4 sm:p-6">
            <div ref={workCanvasRef} className="h-[340px] w-full rounded-2xl bg-black/50 sm:h-[470px]" />
            <p className="mt-4 text-sm text-zinc-300">3D structural bars animation reinforcing momentum and product scale.</p>
          </article>
        </section>

        <section id="about" className="reveal-on-scroll grid min-h-[90vh] items-center gap-8 py-20 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl border border-white/10 bg-black/35 p-6 sm:p-8">
            <h2 className="text-3xl font-semibold sm:text-5xl">About</h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
              I combine strategy, UI, frontend engineering, and motion design in one seamless pipeline. The result is an authentic portfolio presence with cinematic interactions and serious performance.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="float-loop rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">10+ premium launches</div>
              <div className="float-loop rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">GSAP motion architecture</div>
              <div className="float-loop rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">Three.js integration</div>
              <div className="float-loop rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">Mobile-first optimization</div>
            </div>
          </article>
          <article className="rounded-3xl border border-violet-300/20 bg-black/30 p-4 sm:p-6">
            <div ref={aboutCanvasRef} className="h-[340px] w-full rounded-2xl bg-black/50 sm:h-[450px]" />
            <p className="mt-4 text-sm text-zinc-300">Nested torus-knot structures generate a signature identity in 3D.</p>
          </article>
        </section>

        <section id="contact" className="reveal-on-scroll grid min-h-[82vh] items-center gap-8 py-20 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl border border-white/10 bg-black/35 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Contact</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">Ready for something unforgettable?</h2>
            <p className="mt-4 text-sm text-zinc-300 sm:text-base">
              Let&apos;s craft your portfolio or product experience with deeply polished animation, a premium black visual language, and top-tier responsiveness.
            </p>
            <a href="mailto:hello@alifdesign.dev" className="mt-7 inline-flex rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm hover:bg-white/20">
              hello@alifdesign.dev
            </a>
          </article>
          <article className="rounded-3xl border border-cyan-300/20 bg-black/30 p-4 sm:p-6">
            <div ref={contactCanvasRef} className="h-[340px] w-full rounded-2xl bg-black/50 sm:h-[440px]" />
            <p className="mt-4 text-sm text-zinc-300">Animated 3D wire plane closes the journey with a futuristic stage feel.</p>
          </article>
        </section>
      </main>
    </div>
  );
};

export default App;
