import { SVGProps } from "react";

export default function DataBridgeLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 140 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 18c0-5.5 4.5-10 10-10s10 4.5 10 10"
        className="stroke-primary"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="2" cy="18" r="2" className="fill-primary" />
      <circle cx="22" cy="18" r="2" className="fill-primary" />
      <text
        x="30"
        y="17"
        className="fill-current"
        fontFamily="ui-sans-serif, system-ui"
        fontWeight="700"
        fontSize="14"
        letterSpacing="-0.02em"
      >
        DataBridge
      </text>
    </svg>
  );
}
