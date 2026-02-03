import React from 'react';
import { NeonHi } from './components/NeonHi';

const App: React.FC = () => {
  return (
    <main className="min-h-screen w-full bg-black flex items-center justify-center overflow-hidden">
      <NeonHi />
    </main>
  );
};

export default App;