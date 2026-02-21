import React, { useEffect, useMemo, useState } from 'react';

type Cursor = {
  x: number;
  y: number;
};

const projects = [
  {
    name: 'E-Commerce Redesign',
    stack: 'UI/UX • Frontend Development',
    label: 'PROJECT ALPHA',
  },
  {
    name: 'Creative Agency Portfolio',
    stack: 'GSAP • Tailwind • React',
    label: 'PROJECT BETA',
  },
  {
    name: 'SaaS Dashboard System',
    stack: 'Design System • Accessibility • Analytics',
    label: 'PROJECT GAMMA',
  },
];

const App: React.FC = () => {
  const [cursor, setCursor] = useState<Cursor>({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  const reducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    if (reducedMotion || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMove = (event: MouseEvent) => {
      setCursor({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [reducedMotion]);

  const hoverProps = {
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
  };

  return (
    <div className="bg-darkBg text-white selection:bg-brandRed selection:text-white">
      {!reducedMotion && (
        <>
          <div
            className="cursor-dot"
            style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
          />
          <div
            className={`cursor-outline ${hovering ? 'cursor-outline--hover' : ''}`}
            style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
          />
        </>
      )}

      <nav className="fixed top-0 z-40 w-full border-b border-white/10 bg-black/40 px-6 py-5 backdrop-blur md:px-12">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <a href="#top" className="text-3xl font-black tracking-tighter" {...hoverProps}>
            Alif<span className="text-brandRed">.</span>
          </a>

          <div className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
            <a href="#work" className="hover:text-white" {...hoverProps}>Work</a>
            <a href="#about" className="hover:text-white" {...hoverProps}>About</a>
            <a href="#contact" className="hover:text-white" {...hoverProps}>Contact</a>
          </div>

          <a
            href="mailto:hello@alif.dev"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-brandRed hover:text-white"
            {...hoverProps}
          >
            Let's Talk
          </a>
        </div>
      </nav>

      <main id="top" className="mx-auto w-full max-w-[1600px]">
        <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-24 text-center">
          <p className="mb-5 text-sm font-medium text-gray-400 md:text-base">
            👋 my name is Alif Shahariar and I am a freelance
          </p>

          <h1 className="hero-title font-display uppercase tracking-tight">Web Developer</h1>
          <h1 className="hero-title -mt-4 font-display uppercase tracking-tight text-outline-red">
            & UI Designer
          </h1>

          <div className="mt-12 flex w-full max-w-xl flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="#work"
              className="rounded-md border border-brandRed bg-brandRed px-8 py-3 text-sm font-medium transition hover:bg-transparent hover:text-brandRed"
              {...hoverProps}
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="rounded-md border border-white px-8 py-3 text-sm font-medium transition hover:bg-white hover:text-black"
              {...hoverProps}
            >
              Contact Me
            </a>
          </div>

          <p className="mt-10 text-sm text-gray-400 md:absolute md:bottom-10 md:left-12">
            based in <span className="text-white">Natore, Bangladesh.</span>
          </p>
        </section>

        <section className="my-10 overflow-hidden border-y border-red-900 bg-brandRed py-4 text-white">
          <div className="marquee text-4xl uppercase tracking-wider">
            <span>AVAILABLE FOR FREELANCE WORK • CREATIVE DEVELOPMENT • UI/UX DESIGN •</span>
            <span>AVAILABLE FOR FREELANCE WORK • CREATIVE DEVELOPMENT • UI/UX DESIGN •</span>
          </div>
        </section>

        <section id="about" className="mx-auto w-full max-w-7xl px-6 py-24 md:px-12">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-brandRed">01 // Expertise</h2>
            </div>
            <div className="md:col-span-8">
              <h3 className="mb-8 text-3xl leading-tight md:text-5xl">
                I build digital experiences that are <span className="text-outline-red">fast</span>, accessible, and visually
                stunning.
              </h3>
              <div className="mt-10 grid gap-8 border-t border-gray-800 pt-10 sm:grid-cols-2">
                <div>
                  <h4 className="mb-3 text-xl font-bold">Frontend Development</h4>
                  <p className="text-sm leading-relaxed text-gray-400">
                    Crafting responsive, performant websites using React, TypeScript, Tailwind CSS, and purposeful
                    interaction.
                  </p>
                </div>
                <div>
                  <h4 className="mb-3 text-xl font-bold">UI/UX Design</h4>
                  <p className="text-sm leading-relaxed text-gray-400">
                    Designing intuitive interfaces in Figma, prioritizing hierarchy, accessibility, and premium visual
                    systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="mx-auto w-full max-w-7xl px-6 py-16 md:px-12">
          <h2 className="mb-12 text-xs font-semibold uppercase tracking-[0.2em] text-brandRed">02 // Selected Work</h2>
          <div className="space-y-14">
            {projects.map((project) => (
              <article key={project.name} className="group">
                <div className="relative h-[40vh] overflow-hidden rounded-xl bg-darkElevated md:h-[56vh]">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-60 transition group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
                    <span className="font-display text-4xl text-gray-800 transition group-hover:scale-110 group-hover:text-brandRed md:text-6xl">
                      {project.label}
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold group-hover:text-brandRed">{project.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{project.stack}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-700 transition group-hover:border-brandRed group-hover:bg-brandRed">
                    ↗
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="relative mt-20 overflow-hidden border-t border-gray-900 px-6 py-28 md:px-12">
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <h2 className="mb-8 font-display text-5xl uppercase tracking-tighter md:text-8xl">
            Let's create <br />
            <span className="text-outline-red">together.</span>
          </h2>
          <a
            href="mailto:hello@alif.dev"
            className="border-b-2 border-brandRed pb-1 text-xl font-medium transition hover:text-brandRed md:text-3xl"
            {...hoverProps}
          >
            hello@alif.dev
          </a>

          <div className="mt-16 flex justify-center gap-8 text-gray-500">
            <a href="https://github.com" className="hover:text-white" {...hoverProps}>Github</a>
            <a href="https://www.linkedin.com" className="hover:text-white" {...hoverProps}>LinkedIn</a>
            <a href="https://x.com" className="hover:text-white" {...hoverProps}>Twitter</a>
          </div>

          <p className="mt-10 text-sm text-gray-700">© 2026 Alif Shahariar. All rights reserved.</p>
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[18vw] font-display font-black text-white/5">
          ALIF SHAHARIAR
        </div>
      </footer>
    </div>
  );
};

export default App;
