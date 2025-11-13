import { useState } from "react";

export default function Tooltip({ content, setIsHovering, above }) {
  const style = above ? {bottom: "calc(100%)"} : {top: "calc(100%)"};
  return <div 
    className="tooltip"
    style={style}
    onMouseEnter={() => setIsHovering(true)}
    onMouseLeave={() => setIsHovering(false)}
  >
    {content}
  </div>
}

export function TooltipWrapper({ children, above }) {
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringTooltip, setIsHoveringTooltip] = useState(false);

  return (
    <div
      style = {{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children.slice(1)}
      {(isHovering || isHoveringTooltip) && <Tooltip content={children[0]} setIsHovering={setIsHoveringTooltip} above={above}/>}
    </div>
  )
}