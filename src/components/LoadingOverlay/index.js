const LoadingOverlay = ({ message }) => (
  <div className="loading-overlay">
    <div className="loading-overlay__content">
      <div className="flex flex-col items-center space-y-4">
        <div className="loading-overlay__spinner"></div>
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  </div>
);

export default LoadingOverlay; 