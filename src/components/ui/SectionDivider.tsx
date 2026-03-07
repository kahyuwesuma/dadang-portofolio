import React, { forwardRef } from 'react';

const SectionDivider = forwardRef<HTMLDivElement>((props, ref) => {
  return <div ref={ref} className="section-line max-w-7xl mx-auto" />;
});

SectionDivider.displayName = 'SectionDivider';

export default SectionDivider;