import React, { useRef } from 'react';

function ScrollContainer({ children }) {
  const scrollRef = useRef();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -100,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 100,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative w-full overflow-hidden overflow-x scroll-container whitespace-nowrap">
      <button onClick={scrollLeft()} className="left-0 scroll-btn">&lt;</button>
      <button onClick={scrollRight()} className="right-0 scroll-btn">&gt;</button>
      <div ref={scrollRef} className="inline-block scroll-content">
        {children}
      </div>

    </div>
  );
};

export default ScrollContainer;