import { SVGProps } from "react";

export default function LoopifyLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6c-2 0-3.8-1-4.9-2.5M4 6.5C5.1 5 6.9 4 8.9 4c3.3 0 6 2.7 6 6"
        className="stroke-primary"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <text
        x="30"
        y="17"
        className="fill-current"
        fontFamily="ui-sans-serif, system-ui"
        fontWeight="700"
        fontSize="14"
        letterSpacing="-0.02em"
      >
        Loopify
      </text>
    </svg>
  );
}
