import { useState } from "react";

export default function Slider({ name, min, max, def, onChange }) {
  const [val, setVal] = useState(def);

  return <>
    <p>{name}: {val}</p>
    <input type="range" 
      min={min} 
      max={max} 
      value={val} 
      onChange={e => {
        const newVal = e.target.value;
        setVal(newVal);
        onChange(newVal);
      }}
    />
  </>
}