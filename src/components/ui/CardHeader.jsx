'use client';

import React from 'react';

export function CardHeader({ icon: Icon, tone = 'blue', title, qualifier, id, children }) {
  return (
    <div className="cmp-card-head">
      {Icon && (
        <span className={`cmp-badge tone-${tone}`} aria-hidden="true">
          <Icon size={17} strokeWidth={2} />
        </span>
      )}
      <div className="min-w-0 flex-1 flex items-baseline gap-x-2 flex-wrap">
        <h2 id={id} className="cmp-title">
          {title}
        </h2>
        {qualifier && <span className="cmp-qualifier">{qualifier}</span>}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}

export default CardHeader;
