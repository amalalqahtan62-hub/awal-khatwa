'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { SCENES } from '@/lib/scenes';
import { SCENE_VIEWS, themeOf } from './scenes';
import { JourneyHUD } from './parts';
import './present.css';

export function useFit(w = 1600, h = 900) {
  const [s, setS] = useState(1);
  useEffect(() => {
    const f = () => setS(Math.min(window.innerWidth / w, window.innerHeight / h));
    f();
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, [w, h]);
  return s;
}

export default function Stage({ state, stats, now, scale, hideCursor, status }) {
  const sceneIdx = Math.min(SCENES.length - 1, Math.max(0, state?.scene || 0));
  const scene = SCENES[sceneIdx];
  const step = Math.min(scene.steps - 1, state?.step || 0);
  const theme = themeOf(scene.id, step);
  const View = SCENE_VIEWS[scene.id];
  return (
    <div className={'pz-wrap' + (hideCursor ? ' hide-cursor' : '')}>
      <div className={'pz-stage ' + theme} style={{ transform: `scale(${scale})` }}>
        <div className="pz-bg dark" style={{ opacity: theme === 'dark' ? 1 : 0 }} />
        <div className="pz-bg light" style={{ opacity: theme === 'light' ? 1 : 0 }} />
        <div className="pz-grid" style={{ opacity: theme === 'dark' ? 0.18 : 0.3 }} />
        <LayoutGroup>
          <AnimatePresence>
            {scene.part != null && <JourneyHUD key="hud" part={scene.part} />}
          </AnimatePresence>
          <AnimatePresence mode="sync">
            <motion.div key={scene.id} className="pz-scene"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.45 } }}
              transition={{ duration: 0.6 }}>
              <View step={step} state={state} stats={stats} now={now} />
            </motion.div>
          </AnimatePresence>
        </LayoutGroup>
        {status && <div className="pz-status">{status}</div>}
      </div>
    </div>
  );
}
