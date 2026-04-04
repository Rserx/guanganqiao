import { useState } from 'react';
import Opening from './Opening'; // 引入开幕组件
import GuangAnBridge from './GuanganBridge';
import Chapter2 from './Chapter2';

export default function App() {
  const [currentChapter, setCurrentChapter] = useState(0); // 0 为开幕

  return (
    <>
      {currentChapter === 0 && (
        <Opening onComplete={() => setCurrentChapter(1)} />
      )}
      {currentChapter === 1 && (
        <GuangAnBridge onComplete={() => setCurrentChapter(2)} />
      )}
      {currentChapter === 2 && (
        <Chapter2 onComplete={() => setCurrentChapter(3)} />
      )}
    </>
  );
}