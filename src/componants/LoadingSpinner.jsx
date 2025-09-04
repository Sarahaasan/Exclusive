// components/LoadingSpinner.jsx
const LoadingSpinner = ({ 
  size = 'h-12 w-12', 
  color = 'border-red-500', 
  fullScreen = true 
}) => {
  const spinner = (
    <div className={`animate-spin rounded-full ${size} border-b-2 ${color}`}></div>
  );

  if (fullScreen) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;