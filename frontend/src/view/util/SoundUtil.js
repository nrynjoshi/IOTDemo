import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
import beepSound from '../audio/beep-02.mp3';

const SoundUtil = ({ triggerValue }) => {
  const [play, { stop }] = useSound(beepSound);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (triggerValue > 95 && triggerValue < 100) {
        play();
      } else {
        stop();
      }

      if (triggerValue === 110) {
        stop();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [triggerValue, play, stop]);

  return (
    <div>
      <p>Trigger Value: {triggerValue}</p>
    </div>
  );
};

export default SoundUtil;