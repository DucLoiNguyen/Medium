import React, { useRef } from 'react';

function ScrollContainer({ children }) {
  const scrollRef = useRef();

  const scroll = (s) => {
    scrollRef.current.scrollBy({
      left: s
    });
  };

  return (
    <div className="relative flex w-full overflow-hidden overflow-x scroll-container whitespace-nowrap md:block">
      <button onClick={() => scroll(-200)} className="left-0">&lt;</button>
      <div ref={scrollRef} className="overflow-hidden snap-x scroll-smooth md:block">
        {children}
      </div>
      <button onClick={() => scroll(200)} className="right-0"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 448 512"><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" /></svg></button>
    </div>
  );
};

export default ScrollContainer;