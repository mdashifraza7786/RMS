import Skeleton from '@/components/ui/Skeleton';

const LoadingState: React.FC = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <Skeleton variant="text" width="200px" height="32px" />
        <Skeleton variant="circle" width="40px" height="40px" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton variant="text" width="100px" height="14px" />
            <Skeleton variant="rect" width="100%" height="44px" className="rounded-lg" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" width="100px" height="14px" />
        <Skeleton variant="rect" width="100%" height="120px" className="rounded-lg" />
      </div>
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
        <Skeleton variant="rect" width="100px" height="40px" className="rounded-lg" />
        <Skeleton variant="rect" width="120px" height="40px" className="rounded-lg" />
      </div>
      <div className="flex flex-col items-center justify-center pt-8">
        <p className="text-primary font-medium animate-pulse">Registering new member...</p>
      </div>
    </div>
  );
};

export default LoadingState; 