import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
    return (
        <div className='w-full h-screen p-8 space-y-8 bg-gray-50'>
            <div className="flex justify-between items-center">
                <Skeleton variant="text" width="200px" height="40px" />
                <Skeleton variant="circle" width="40px" height="40px" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} variant="rect" width="100%" height="160px" className="rounded-xl" />
                ))}
            </div>
            <div className="space-y-4">
                <Skeleton variant="rect" width="100%" height="400px" className="rounded-xl" />
            </div>
        </div>
    )
}