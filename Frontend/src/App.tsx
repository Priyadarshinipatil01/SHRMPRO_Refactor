import React from 'react';
import { TranslationProvider } from './TranslationContext';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <TranslationProvider>
      <Header />
    </TranslationProvider>
  );
};

export default App;
