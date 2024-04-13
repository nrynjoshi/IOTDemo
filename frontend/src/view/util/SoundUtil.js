import React, { useState, useEffect } from 'react';
import useSound from 'use-sound';
import beepSound from '../audio/beep-02.mp3';

const SoundUtil = ({value, minNormalValue, maxNormalValue }) => {
  const [play, { stop }] = useSound(beepSound);
  const [showTag, setShowTag] = useState(false);

  useEffect(() => {
    let  intervalId = null
    if(!minNormalValue && !maxNormalValue){
      return;
    }
    play(); // Play the sound when the component mounts

    if (minNormalValue > value || maxNormalValue < value) {
      setShowTag(true);
      intervalId = setInterval(() => play(), 1300);
    }else {
      setShowTag(false);
      stop();
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [value, minNormalValue, maxNormalValue, play, stop ]);

  return (
    <>
      {showTag && (
        <span role="img" className='blink' aria-label="Person with lines near mouth">
          🗣
        </span>
      )}
    </>
  );
};

export default SoundUtil;