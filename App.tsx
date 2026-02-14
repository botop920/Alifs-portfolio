import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    THREE: any;
    gsap: any;
  }
}

const projects = [
  {
    title: 'Phantom Commerce',
    blurb:
      'An atmospheric shopping flow where products emerge from darkness with precision micro-transitions.',
    tags: ['React', 'GSAP', 'Conversion UX'],
  },
  {
    title: 'Pulse Foundry',
    blurb:
      'A founder operating system that turns noisy startup signals into a calm, visual command center.',
    tags: ['TypeScript', 'Data Viz', 'Motion System'],
  },
  {
    title: 'Nightline Studio',
    blurb:
      'Brand + web experiences for premium digital products with tactile interactions and glow physics.',
    tags: ['Brand System', 'WebGL', 'Performance'],
  },
];

const App: React.FC = () => {
  const threeMountRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE) {
      return;
    }

    const mountNode = threeMountRef.current;
    if (!mountNode) {
      return;
    }

    const isMobile = window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountNode.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 12;

    const group = new THREE.Group();
    scene.add(group);

    const pointsGeometry = new THREE.BufferGeometry();
    const count = isMobile ? 900 : 1800;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const radius = 6 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      color: '#89b4ff',
      size: isMobile ? 0.03 : 0.04,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    group.add(points);

    const ringGeometry = new THREE.TorusGeometry(4.7, 0.045, 16, 160);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: '#b58cff', transparent: true, opacity: 0.45 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = 1;
    group.add(ring);

    let rafId = 0;
    const targetRotation = { x: 0.1, y: 0.1 };
    const currentRotation = { x: 0.1, y: 0.1 };

    const animate = () => {
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.04;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.04;

      group.rotation.x = currentRotation.x;
      group.rotation.y = currentRotation.y;

      points.rotation.y += 0.0009;
      ring.rotation.z += 0.0018;

      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(animate);
    };
    animate();

    const onMove = (x: number, y: number) => {
      const nx = (x / window.innerWidth) - 0.5;
      const ny = (y / window.innerHeight) - 0.5;
      targetRotation.y = nx * 0.9;
      targetRotation.x = ny * 0.45;
    };

    const handleMouseMove = (event: MouseEvent) => onMove(event.clientX, event.clientY);
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches[0]) {
        onMove(event.touches[0].clientX, event.touches[0].clientY);
      }
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      mountNode.removeChild(renderer.domElement);
      ringGeometry.dispose();
      ringMaterial.dispose();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap || !rootRef.current || !heroRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-reveal',
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 1, ease: 'power3.out' },
      );

      gsap.fromTo(
        '.project-card',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.9, delay: 0.25, ease: 'power2.out' },
      );
    }, rootRef);

    const quickX = gsap.quickTo(heroRef.current, 'x', { duration: 0.7, ease: 'power3.out' });
    const quickY = gsap.quickTo(heroRef.current, 'y', { duration: 0.7, ease: 'power3.out' });

    const interactiveMove = (x: number, y: number) => {
      const dx = (x / window.innerWidth - 0.5) * 20;
      const dy = (y / window.innerHeight - 0.5) * 16;
      quickX(dx);
      quickY(dy);
    };

    const onMouseMove = (event: MouseEvent) => interactiveMove(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches[0]) {
        interactiveMove(event.touches[0].clientX, event.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-hidden bg-[#030303] text-zinc-100">
      <div ref={threeMountRef} className="pointer-events-none fixed inset-0 z-0" />
      <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(117,153,255,0.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(182,119,255,0.18),transparent_38%),linear-gradient(to_bottom,rgba(0,0,0,0.3),#030303_70%)]" />

      <main className="relative z-20 mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
        <section ref={heroRef} className="rounded-3xl border border-white/10 bg-black/35 p-6 backdrop-blur-md sm:p-10">
          <p className="hero-reveal text-xs uppercase tracking-[0.34em] text-violet-200/80">Alif · Portfolio Experience</p>
          <h1 className="hero-reveal mt-4 text-4xl font-semibold leading-tight text-white sm:text-6xl">
            Original dark interfaces with motion that feels alive.
          </h1>
          <p className="hero-reveal mt-5 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
            I design and engineer digital products that blend cinematic art direction, real-time interactions, and clean performance architecture. Every section is handcrafted to be bold, responsive, and unmistakably unique.
          </p>
          <div className="hero-reveal mt-8 flex flex-wrap gap-3">
            <a href="#work" className="rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm hover:bg-white/20">
              View Work
            </a>
            <a href="#contact" className="rounded-full border border-violet-300/40 px-5 py-3 text-sm text-violet-100 hover:bg-violet-400/20">
              Start Project
            </a>
          </div>
        </section>

        <section id="work" className="mt-12 grid gap-5 md:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="project-card rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40"
            >
              <h2 className="text-2xl font-medium text-white">{project.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{project.blurb}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/15 px-3 py-1 text-xs text-zinc-200">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-3xl border border-white/10 bg-black/40 p-6 sm:p-8" id="contact">
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-400">Contact</p>
          <h3 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Let&apos;s build something mind-blowing.</h3>
          <p className="mt-4 max-w-2xl text-sm text-zinc-300 sm:text-base">
            Need a premium portfolio, product landing page, or full digital brand system with advanced animations and perfect responsiveness? I can craft it end-to-end.
          </p>
          <a
            href="mailto:hello@alifdesign.dev"
            className="mt-6 inline-flex rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/20"
          >
            hello@alifdesign.dev
          </a>
        </section>
      </main>
    </div>
  );
};

export default App;
