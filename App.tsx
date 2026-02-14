import React, { useEffect, useMemo, useRef, useState } from 'react';

declare global {
  interface Window {
    THREE: any;
    gsap: any;
  }
}

type Page = 'home' | 'work' | 'about' | 'contact';

const navItems: { id: Page; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

const workItems = [
  {
    title: 'Nebula Brand OS',
    detail: 'Complete product + brand framework with immersive transitions and data storytelling.',
  },
  {
    title: 'Pulse Commerce',
    detail: 'Luxury e-commerce motion language tuned for conversion and product desire.',
  },
  {
    title: 'Aether Dashboard',
    detail: 'Realtime executive command center with cinematic chart interactions.',
  },
];

function useThreeWidget(
  mountRef: React.MutableRefObject<HTMLDivElement | null>,
  variant: 'sphere' | 'knots' | 'columns',
) {
  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE || !mountRef.current) {
      return;
    }

    const mount = mountRef.current;
    const w = mount.clientWidth || 400;
    const h = mount.clientHeight || 300;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, w / h, 0.1, 1000);
    camera.position.z = 8;

    const group = new THREE.Group();
    scene.add(group);

    const disposers: Array<() => void> = [];

    if (variant === 'sphere') {
      const g = new THREE.IcosahedronGeometry(2.1, 8);
      const m = new THREE.PointsMaterial({ color: '#88bbff', size: 0.04, transparent: true, opacity: 0.9 });
      const points = new THREE.Points(g, m);
      group.add(points);
      disposers.push(() => {
        g.dispose();
        m.dispose();
      });
    }

    if (variant === 'knots') {
      for (let i = 0; i < 3; i += 1) {
        const g = new THREE.TorusKnotGeometry(1.2 + i * 0.4, 0.05, 120, 16);
        const m = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? '#b191ff' : '#77d8ff',
          transparent: true,
          opacity: 0.35,
          wireframe: true,
        });
        const mesh = new THREE.Mesh(g, m);
        mesh.rotation.x = i * 0.6;
        mesh.rotation.y = i * 0.4;
        group.add(mesh);
        disposers.push(() => {
          g.dispose();
          m.dispose();
        });
      }
    }

    if (variant === 'columns') {
      for (let i = 0; i < 30; i += 1) {
        const g = new THREE.BoxGeometry(0.18, 0.5 + Math.random() * 2.5, 0.18);
        const m = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? '#7ab5ff' : '#e0a7ff',
          transparent: true,
          opacity: 0.55,
        });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.x = (Math.random() - 0.5) * 7;
        mesh.position.y = (Math.random() - 0.5) * 4;
        mesh.position.z = (Math.random() - 0.5) * 4;
        group.add(mesh);
        disposers.push(() => {
          g.dispose();
          m.dispose();
        });
      }
    }

    let raf = 0;
    const mouse = { x: 0, y: 0 };

    const tick = () => {
      group.rotation.y += 0.003;
      group.rotation.x += 0.0018;
      group.rotation.y += mouse.x * 0.02;
      group.rotation.x += mouse.y * 0.01;
      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(tick);
    };
    tick();

    const onMove = (x: number, y: number) => {
      mouse.x = x / window.innerWidth - 0.5;
      mouse.y = y / window.innerHeight - 0.5;
    };

    const onMouse = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onResize = () => {
      const nw = mount.clientWidth || 400;
      const nh = mount.clientHeight || 300;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('resize', onResize);
      disposers.forEach((d) => d());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [mountRef, variant]);
}

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');

  const pageTitle = useMemo(() => {
    if (page === 'home') return 'Cinematic Portfolio';
    if (page === 'work') return 'Selected Work';
    if (page === 'about') return 'About Alif';
    return 'Contact';
  }, [page]);

  const shellRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const heroThreeRef = useRef<HTMLDivElement | null>(null);
  const workThreeRef = useRef<HTMLDivElement | null>(null);
  const aboutThreeRef = useRef<HTMLDivElement | null>(null);

  useThreeWidget(heroThreeRef, 'sphere');
  useThreeWidget(workThreeRef, 'columns');
  useThreeWidget(aboutThreeRef, 'knots');

  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap || !shellRef.current || !pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.nav-item',
        { y: -14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
      );
    }, shellRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap || !pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.page-reveal',
        { y: 32, opacity: 0, scale: 0.985 },
        { y: 0, opacity: 1, scale: 1, duration: 0.85, stagger: 0.07, ease: 'power3.out' },
      );

      gsap.fromTo(
        '.floaty',
        { y: 0 },
        { y: -12, duration: 2.2, repeat: -1, yoyo: true, stagger: 0.12, ease: 'sine.inOut' },
      );
    }, pageRef);

    return () => ctx.revert();
  }, [page]);

  const renderPage = () => {
    if (page === 'home') {
      return (
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="page-reveal rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-md sm:p-10">
            <p className="text-xs uppercase tracking-[0.35em] text-violet-200/80">Alif · Professional Portfolio</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-6xl">
              Multi-page digital experiences with elite motion systems.
            </h1>
            <p className="mt-5 max-w-xl text-sm text-zinc-300 sm:text-base">
              Original, black-theme, high-end design crafted for founders and premium brands. Built with realtime 3D, GSAP motion choreography, and mobile-first precision.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => setPage('work')} className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm hover:bg-white/20">
                View Work
              </button>
              <button type="button" onClick={() => setPage('contact')} className="rounded-full border border-violet-300/40 px-5 py-3 text-sm text-violet-100 hover:bg-violet-400/20">
                Hire Me
              </button>
            </div>
          </article>
          <article className="page-reveal rounded-3xl border border-white/10 bg-black/25 p-4 sm:p-6">
            <div ref={heroThreeRef} className="floaty h-[260px] w-full rounded-2xl bg-black/40 sm:h-[320px]" />
            <p className="mt-4 text-sm text-zinc-300">Interactive hero object reacts to mouse and touch movement in real time.</p>
          </article>
        </section>
      );
    }

    if (page === 'work') {
      return (
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="page-reveal rounded-3xl border border-white/10 bg-black/35 p-5 sm:p-7">
            <h2 className="text-3xl font-semibold sm:text-4xl">Selected Work</h2>
            <p className="mt-3 text-sm text-zinc-300">Every project is treated as a cinematic product launch, not a template delivery.</p>
            <div className="mt-6 space-y-4">
              {workItems.map((item) => (
                <div key={item.title} className="page-reveal rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <h3 className="text-xl font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm text-zinc-300">{item.detail}</p>
                </div>
              ))}
            </div>
          </article>
          <article className="page-reveal rounded-3xl border border-white/10 bg-black/25 p-4 sm:p-6">
            <div ref={workThreeRef} className="floaty h-[320px] w-full rounded-2xl bg-black/40 sm:h-[460px]" />
            <p className="mt-4 text-sm text-zinc-300">3D structural bars visualize velocity, scale, and product momentum.</p>
          </article>
        </section>
      );
    }

    if (page === 'about') {
      return (
        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="page-reveal rounded-3xl border border-white/10 bg-black/35 p-6 sm:p-8">
            <h2 className="text-3xl font-semibold sm:text-4xl">About</h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
              I combine design direction, frontend engineering, and motion design into one focused workflow. The result is a professional portfolio ecosystem: not just one page, but a full navigable experience with distinctive interactions.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="page-reveal rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">10+ premium launches</div>
              <div className="page-reveal rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">3D + GSAP specialist</div>
              <div className="page-reveal rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">Mobile-first motion UX</div>
              <div className="page-reveal rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">Performance-minded builds</div>
            </div>
          </article>
          <article className="page-reveal rounded-3xl border border-white/10 bg-black/25 p-4 sm:p-6">
            <div ref={aboutThreeRef} className="floaty h-[320px] w-full rounded-2xl bg-black/40 sm:h-[420px]" />
            <p className="mt-4 text-sm text-zinc-300">Multiple torus-knot forms create a dynamic signature identity object.</p>
          </article>
        </section>
      );
    }

    return (
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="page-reveal rounded-3xl border border-white/10 bg-black/35 p-6 sm:p-9">
          <h2 className="text-3xl font-semibold sm:text-4xl">Contact</h2>
          <p className="mt-4 text-sm text-zinc-300 sm:text-base">
            Let’s build a professional portfolio, SaaS launch site, or product experience with advanced 3D + GSAP interactions.
          </p>
          <a href="mailto:hello@alifdesign.dev" className="page-reveal mt-7 inline-flex rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm hover:bg-white/20">
            hello@alifdesign.dev
          </a>
        </article>
        <article className="page-reveal rounded-3xl border border-violet-300/25 bg-gradient-to-b from-violet-400/15 to-cyan-400/10 p-6 sm:p-9">
          <p className="text-xs uppercase tracking-[0.3em] text-violet-100">Availability</p>
          <h3 className="mt-3 text-2xl font-semibold">Open for selected projects</h3>
          <p className="mt-4 text-sm text-zinc-200">
            Strategy, UI, motion direction, and frontend implementation — from first concept to polished production.
          </p>
        </article>
      </section>
    );
  };

  return (
    <div ref={shellRef} className="min-h-screen bg-[#020202] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_15%,rgba(124,118,255,0.2),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(75,193,255,0.16),transparent_38%),linear-gradient(to_bottom,#050505,#020202)]" />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 pt-6 sm:px-8 sm:pt-10">
        <h1 className="page-reveal text-sm uppercase tracking-[0.28em] text-zinc-300">Alif Studio</h1>
        <nav className="flex flex-wrap justify-end gap-2 sm:gap-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPage(item.id)}
              className={`nav-item rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition ${
                page === item.id
                  ? 'border-cyan-300/60 bg-cyan-400/10 text-cyan-100'
                  : 'border-white/15 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.1]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main ref={pageRef} className="mx-auto mt-8 w-full max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20">
        <p className="page-reveal mb-4 text-xs uppercase tracking-[0.25em] text-zinc-500">{pageTitle}</p>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
