function GradientSVG() {
    const idCSS = "hello";
    const gradientTransform = `rotate(100)`;
    return (
      <svg style={{ width: '50%', margin: 'auto',marginTop:'-20em' }}>
        <defs>
          <linearGradient id={idCSS} gradientTransform={gradientTransform}>
            <stop offset="10%" stopColor="#f71717" />
            <stop offset="20%" stopColor="#ff7300" />
            <stop offset="40%" stopColor="#e9dc65" />
            <stop offset="70%" stopColor="#94ff01" />
            <stop offset="100%" stopColor="#02c202" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  export default GradientSVG;