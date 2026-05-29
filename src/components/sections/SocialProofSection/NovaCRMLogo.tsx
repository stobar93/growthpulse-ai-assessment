import { SVGProps } from "react";

export default function NovaCRMLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"
        className="fill-primary"
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
        NovaCRM
      </text>
    </svg>
  );
}
