import { ImageComparison } from "@/components/ui/image-comparison-slider";

export default function ImageComparisonDemo() {
  return (
    <div className="w-full min-h-screen bg-gray-900 flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Image Comparison Slider</h1>
        <p className="text-lg text-gray-400">Drag the slider to compare the two images.</p>
      </div>
      
      <ImageComparison
        beforeImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&crop=center"
        afterImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&crop=center&sat=100&con=50&bright=20"
        altBefore="Mountain landscape - original"
        altAfter="Mountain landscape - enhanced"
      />
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 mb-4">Try these other examples:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
          <ImageComparison
            beforeImage="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&crop=center"
            afterImage="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&crop=center&sat=150&con=80&bright=30"
            altBefore="Forest - original"
            altAfter="Forest - enhanced"
          />
          <ImageComparison
            beforeImage="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&crop=center"
            afterImage="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop&crop=center&sat=120&con=60&bright=15"
            altBefore="Beach - original"
            altAfter="Beach - enhanced"
          />
        </div>
      </div>
    </div>
  );
}
