import { cn } from '@/lib/utils';

/**
 * Logo Component
 * Renders the full brand identity: the LogoIcon followed by the "Task Fusion" wordmark.
 */
export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <LogoIcon className="size-8" />
      <span className="text-xl font-bold tracking-tight">
        Task{' '}
        <span className="bg-gradient-to-br from-[#FF512F] to-[#DD2476] bg-clip-text text-transparent">
          Fusion
        </span>
      </span>
    </div>
  );
};

export const LogoIcon = ({ className }: { className?: string }) => {
  // Determine fill color
  const fill = 'url(#sunset-gradient)';

  return (
    <svg
      width="48"
      height="48"
      viewBox="-4 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('size-6', className)}
    >
      <g fill={fill}>
        {/* Layered Paths with varying opacities to create depth */}
        <path
          d="m9.72461 41.7983h18.49589c1.2717 0 2.4469-.6785 3.0827-1.7798l4.1102-7.1191h-20.5481z"
          opacity=".7"
        />
        <path
          d="m25.1445 15.1015h-20.55661l4.11021-7.11909c.63585-1.10133 1.811-1.77977 3.0827-1.77977h18.4959z"
          opacity=".4"
        />
        <path
          d="m39.5272 25.7801c.6358-1.1014.6358-2.4582 0-3.5596l-4.1102-7.1191-5.1378 8.8989h-20.55068l5.13718 8.8989h20.5481l.0016-.0027.0016.0027z"
          opacity=".4"
        />
        <path d="m14.8634 32.8992-5.13775-8.8988-5.13776 8.8988 5.13776 8.8989z" />
        <path
          d="m25.1445 15.1014h-20.55593l-4.108166 7.1192c-.635516 1.1013-.635318 2.458.000521 3.5591l4.111125 7.1195 5.13775-8.8989h20.55l.0013-.0021z"
          opacity=".7"
        />
        <path d="m35.4181 15.1015-5.1378-8.89886-5.1377 8.89886 5.1377 8.8989z" />
      </g>

      <defs>
        <linearGradient
          id="sunset-gradient"
          x1="0"
          y1="0"
          x2="48"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF512F" />
          <stop offset="1" stopColor="#DD2476" />
        </linearGradient>
      </defs>
    </svg>
  );
};
