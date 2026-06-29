import { useState } from 'react';

/**
 * Renders any element while merging `hoverStyle` on hover and `focusStyle` on
 * focus — the React equivalent of the original template's `style-hover` /
 * `style-focus` attributes.
 */
export default function Hoverable({
  as: Tag = 'div',
  style,
  hoverStyle,
  focusStyle,
  children,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);

  const merged = {
    ...style,
    ...(hover && hoverStyle ? hoverStyle : null),
    ...(focus && focusStyle ? focusStyle : null),
  };

  return (
    <Tag
      {...rest}
      style={merged}
      onMouseEnter={(e) => { setHover(true); rest.onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHover(false); rest.onMouseLeave?.(e); }}
      onFocus={(e) => { setFocus(true); rest.onFocus?.(e); }}
      onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
    >
      {children}
    </Tag>
  );
}
