import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    THREE: any;
    gsap: any;
  }
}

const featuredProjects = [
  {
    name: 'Quantum Ledger',
    type: 'Fintech Platform',
    description:
      'A secure, real-time financial intelligence platform with dark-mode UX and operational clarity for enterprise teams.',
  },
  {
    name: 'Neural Commerce',
    type: 'AI E-commerce Stack',
    description:
      'Adaptive storefront architecture that personalizes layouts, offers, and micro-journeys in milliseconds.',
  },
  {
    name: 'Atlas Control',
    type: 'SaaS Product Suite',
    description:
      'An executive command layer for growth teams, merging analytics, planning, and workflow automation.',
  },
];

const capabilities = [
  'Full-stack product engineering',
  'UI systems + design language architecture',
  'WebGL / Three.js scene integration',
  'GSAP interaction systems',
  'Performance-first frontend optimization',
  'End-to-end launch ownership',
];

const App: React.FC = () => {
  const appRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const orbRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE || !heroRef.current || !orbRef.current) {
      return;
    }

    const mount = heroRef.current;
    const orbMount = orbRef.current;

    const createRenderer = (el: HTMLDivElement) => {
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(el.clientWidth || 400, el.clientHeight || 300);
      el.appendChild(renderer.domElement);
      return renderer;
    };

    const heroRenderer = createRenderer(mount);
    const orbRenderer = createRenderer(orbMount);

    const heroScene = new THREE.Scene();
    const orbScene = new THREE.Scene();

    const heroCamera = new THREE.PerspectiveCamera(50, (mount.clientWidth || 1) / (mount.clientHeight || 1), 0.1, 1000);
    heroCamera.position.z = 9;
    const orbCamera = new THREE.PerspectiveCamera(55, (orbMount.clientWidth || 1) / (orbMount.clientHeight || 1), 0.1, 1000);
    orbCamera.position.z = 7;

    const heroGroup = new THREE.Group();
    const orbGroup = new THREE.Group();
    heroScene.add(heroGroup);
    orbScene.add(orbGroup);

    const ambientA = new THREE.AmbientLight('#a8c1ff', 0.65);
    const pointA = new THREE.PointLight('#7dd3fc', 1.2);
    pointA.position.set(6, 6, 6);
    heroScene.add(ambientA, pointA);

    const ambientB = new THREE.AmbientLight('#c2a3ff', 0.55);
    const pointB = new THREE.PointLight('#93c5fd', 1);
    pointB.position.set(-4, 5, 5);
    orbScene.add(ambientB, pointB);

    const heroSphereGeo = new THREE.IcosahedronGeometry(2.2, 10);
    const heroSphereMat = new THREE.PointsMaterial({
      color: '#8db7ff',
      size: 0.028,
      transparent: true,
      opacity: 0.9,
    });
    const heroPoints = new THREE.Points(heroSphereGeo, heroSphereMat);
    heroGroup.add(heroPoints);

    const ringGeo = new THREE.TorusGeometry(3.1, 0.045, 20, 180);
    const ringMat = new THREE.MeshBasicMaterial({ color: '#d3a5ff', transparent: true, opacity: 0.8 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = 1.1;
    heroGroup.add(ring);

    const orbGeo = new THREE.OctahedronGeometry(1.8, 3);
    const orbMat = new THREE.MeshStandardMaterial({
      color: '#8ec5ff',
      emissive: '#223a55',
      metalness: 0.35,
      roughness: 0.3,
      wireframe: true,
    });
    const orbMesh = new THREE.Mesh(orbGeo, orbMat);
    orbGroup.add(orbMesh);

    const bars: any[] = [];
    for (let i = 0; i < 28; i += 1) {
      const barGeo = new THREE.BoxGeometry(0.1, 0.7 + Math.random() * 1.8, 0.1);
      const barMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? '#7dd3fc' : '#c4b5fd',
        transparent: true,
        opacity: 0.6,
      });
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set((Math.random() - 0.5) * 5.5, (Math.random() - 0.5) * 4.2, (Math.random() - 0.5) * 3.5);
      orbGroup.add(bar);
      bars.push({ geo: barGeo, mat: barMat, bar });
    }

    let frame = 0;
    const pointer = { x: 0, y: 0 };

    const animate = () => {
      heroGroup.rotation.y += 0.0026 + pointer.x * 0.01;
      heroGroup.rotation.x += 0.0013 + pointer.y * 0.006;
      ring.rotation.z += 0.0025;
      heroPoints.rotation.x += 0.0006;

      orbGroup.rotation.y += 0.0038 + pointer.x * 0.01;
      orbGroup.rotation.x += 0.0018 + pointer.y * 0.006;
      orbMesh.rotation.z += 0.003;

      heroRenderer.render(heroScene, heroCamera);
      orbRenderer.render(orbScene, orbCamera);

      frame = window.requestAnimationFrame(animate);
    };
    animate();

    const setPointer = (x: number, y: number) => {
      pointer.x = x / window.innerWidth - 0.5;
      pointer.y = y / window.innerHeight - 0.5;
    };

    const onMouseMove = (event: MouseEvent) => setPointer(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches[0]) {
        setPointer(event.touches[0].clientX, event.touches[0].clientY);
      }
    };

    const onResize = () => {
      const mw = mount.clientWidth || 400;
      const mh = mount.clientHeight || 300;
      const ow = orbMount.clientWidth || 400;
      const oh = orbMount.clientHeight || 300;

      heroCamera.aspect = mw / mh;
      heroCamera.updateProjectionMatrix();
      heroRenderer.setSize(mw, mh);

      orbCamera.aspect = ow / oh;
      orbCamera.updateProjectionMatrix();
      orbRenderer.setSize(ow, oh);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);

      heroSphereGeo.dispose();
      heroSphereMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      orbGeo.dispose();
      orbMat.dispose();

      bars.forEach(({ geo, mat }: { geo: any; mat: any }) => {
        geo.dispose();
        mat.dispose();
      });

      heroRenderer.dispose();
      orbRenderer.dispose();

      if (heroRenderer.domElement.parentNode === mount) {
        mount.removeChild(heroRenderer.domElement);
      }
      if (orbRenderer.domElement.parentNode === orbMount) {
        orbMount.removeChild(orbRenderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap || !appRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo('.nav-reveal', { y: -16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.65, ease: 'power3.out' });
      gsap.fromTo('.hero-reveal', { y: 38, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: 'power3.out' });
      gsap.to('.ambient-float', { y: -12, duration: 2.3, yoyo: true, repeat: -1, ease: 'sine.inOut', stagger: 0.16 });
    }, appRef);

    const targets = Array.from(document.querySelectorAll<HTMLElement>('.section-reveal'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(entry.target, { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 0.95, ease: 'power3.out' });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={appRef} className="min-h-screen bg-[#040404] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_12%,rgba(99,102,241,0.2),transparent_38%),radial-gradient(circle_at_80%_16%,rgba(56,189,248,0.14),transparent_40%),linear-gradient(to_bottom,#070707,#040404)]" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <p className="nav-reveal text-xs uppercase tracking-[0.36em] text-zinc-300">Alif • Developer Studio</p>
          <nav className="flex flex-wrap gap-2">
            <a href="#projects" className="nav-reveal rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.16em] hover:bg-white/10">Projects</a>
            <a href="#expertise" className="nav-reveal rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.16em] hover:bg-white/10">Expertise</a>
            <a href="#process" className="nav-reveal rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.16em] hover:bg-white/10">Process</a>
            <a href="#contact" className="nav-reveal rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.16em] hover:bg-white/10">Contact</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        <section className="grid min-h-[90vh] items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="hero-reveal rounded-3xl border border-white/10 bg-black/35 p-7 backdrop-blur-md sm:p-10">
            <p className="text-xs uppercase tracking-[0.34em] text-violet-200/80">Premium Engineering Portfolio</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-6xl">
              I build high-performance products with cinematic interaction design.
            </h1>
            <p className="mt-5 max-w-xl text-sm text-zinc-300 sm:text-base">
              Fully reimagined from scratch: a professional developer site with deep black aesthetics, custom 3D motion scenes, GSAP choreography, and mobile-responsive polish.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#projects" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm hover:bg-white/20">View Projects</a>
              <a href="#contact" className="rounded-full border border-violet-300/40 px-6 py-3 text-sm text-violet-100 hover:bg-violet-400/20">Hire Me</a>
            </div>
          </article>

          <article className="hero-reveal rounded-3xl border border-cyan-300/20 bg-black/30 p-4 sm:p-6">
            <div ref={heroRef} className="ambient-float h-[330px] w-full rounded-2xl bg-black/45 sm:h-[430px]" />
            <p className="mt-4 text-sm text-zinc-300">Signature hero particle sphere rendered with Three.js and reactive motion.</p>
          </article>
        </section>

        <section id="projects" className="section-reveal grid min-h-[90vh] items-center gap-8 py-20 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-3xl border border-white/10 bg-black/35 p-6 sm:p-8">
            <h2 className="text-3xl font-semibold sm:text-5xl">Featured Projects</h2>
            <p className="mt-3 text-sm text-zinc-300">Built for scale, narrative clarity, and serious business impact.</p>
            <div className="mt-6 space-y-4">
              {featuredProjects.map((project) => (
                <div key={project.name} className="ambient-float rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{project.type}</p>
                  <h3 className="mt-2 text-2xl font-medium">{project.name}</h3>
                  <p className="mt-2 text-sm text-zinc-300">{project.description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-violet-300/20 bg-black/30 p-4 sm:p-6">
            <div ref={orbRef} className="h-[340px] w-full rounded-2xl bg-black/50 sm:h-[470px]" />
            <p className="mt-4 text-sm text-zinc-300">Second 3D scene to reinforce premium visual language and technical depth.</p>
          </article>
        </section>

        <section id="expertise" className="section-reveal py-20">
          <article className="rounded-3xl border border-white/10 bg-black/35 p-6 sm:p-8">
            <h2 className="text-3xl font-semibold sm:text-5xl">Expertise</h2>
            <p className="mt-3 max-w-3xl text-sm text-zinc-300 sm:text-base">
              From architecture to animation systems, every layer is production-minded and built for maintainable excellence.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((capability) => (
                <div key={capability} className="ambient-float rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-200">
                  {capability}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section id="process" className="section-reveal py-20">
          <article className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent p-6 sm:p-8">
            <h2 className="text-3xl font-semibold sm:text-5xl">My Build Process</h2>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              <div className="ambient-float rounded-2xl border border-white/10 bg-black/35 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">01</p>
                <h3 className="mt-2 text-xl font-medium">Strategy + Wireframes</h3>
                <p className="mt-2 text-sm text-zinc-300">Define business outcomes, information architecture, and interface intent.</p>
              </div>
              <div className="ambient-float rounded-2xl border border-white/10 bg-black/35 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-violet-200">02</p>
                <h3 className="mt-2 text-xl font-medium">Design + Motion Systems</h3>
                <p className="mt-2 text-sm text-zinc-300">Craft visual identity, component logic, and interaction choreography.</p>
              </div>
              <div className="ambient-float rounded-2xl border border-white/10 bg-black/35 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-200">03</p>
                <h3 className="mt-2 text-xl font-medium">Engineering + Launch</h3>
                <p className="mt-2 text-sm text-zinc-300">Implement, optimize, QA, and ship with measurable performance confidence.</p>
              </div>
            </div>
          </article>
        </section>

        <section id="contact" className="section-reveal pb-10 pt-16">
          <article className="rounded-3xl border border-white/10 bg-black/35 p-6 sm:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Contact</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">Let’s build your next premium product.</h2>
            <p className="mt-4 max-w-2xl text-sm text-zinc-300 sm:text-base">
              If you want a developer who handles architecture, visual identity, interaction systems, and launch execution end-to-end, I’m ready.
            </p>
            <a href="mailto:hello@alifdesign.dev" className="mt-7 inline-flex rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm hover:bg-white/20">
              hello@alifdesign.dev
            </a>
          </article>
        </section>
      </main>
    </div>
  );
};

export default App;
