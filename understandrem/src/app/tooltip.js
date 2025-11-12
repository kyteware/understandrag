import { useState } from "react";

export default function Tooltip({ content, setIsHovering }) {
  return <div 
    className="tooltip"
    onMouseEnter={() => setIsHovering(true)}
    onMouseLeave={() => setIsHovering(false)}
  >
    {content}
  </div>
}

export function TooltipWrapper({ children }) {
  const [isHovering, setIsHovering] = useState(false);
  const [isHoveringTooltip, setIsHoveringTooltip] = useState(false);

  return (
    <div
      style = {{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children.slice(1)}
      {(isHovering || isHoveringTooltip) && <Tooltip content={children[0]} setIsHovering={setIsHoveringTooltip}/>}
    </div>
  )
}