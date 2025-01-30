import { Button } from "@/components/ui/button";

interface SubmissionStatus {
  hasStory: boolean;
  hasPhotos: boolean;
}

interface SubmissionPanelProps {
  status: SubmissionStatus;
  onSubmit: () => void;
}

export default function SubmissionPanel({ status, onSubmit }: SubmissionPanelProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center 
              ${status.hasStory ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
              {status.hasStory && '✓'}
            </div>
            <span className="text-sm">Story shared</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center 
              ${status.hasPhotos ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}>
              {status.hasPhotos && '✓'}
            </div>
            <span className="text-sm">Photos uploaded</span>
          </div>
        </div>
        <Button 
          onClick={onSubmit}
          disabled={!status.hasStory && !status.hasPhotos}
          className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
        >
          Complete Submission
        </Button>
      </div>
    </div>
  );
} 