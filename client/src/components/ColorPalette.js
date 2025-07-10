import React from 'react';

const ColorPalette = ({ colors, onColorSelect }) => (
  <div className="color-palette" style={{ display: 'flex', justifyContent: 'center', gap: '12px', margin: '16px 0' }}>
    {colors.map(color => (
      <button
        key={color}
        onClick={() => onColorSelect(color)}
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: color,
          border: '2px solid #333',
          margin: '0 2px',
          cursor: 'pointer',
          outline: 'none'
        }}
        aria-label={color}
        type="button"
      />
    ))}
  </div>
);

export default ColorPalette;