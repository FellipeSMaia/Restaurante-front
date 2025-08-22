const ProgressIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex justify-center mt-4 space-x-2">
    {Array.from({ length: totalSteps }, (_, index) => (
      <div
        key={index}
        className={`w-3 h-3 rounded-full transition-colors ${
          currentStep > index ? "bg-blue-500" : "bg-gray-300"
        }`}
      />
    ))}
  </div>
);

export default ProgressIndicator;
