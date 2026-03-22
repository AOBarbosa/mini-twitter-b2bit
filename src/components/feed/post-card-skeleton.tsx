export function PostCardSkeleton() {
  return (
    <div className="bg-white dark:bg-secondary-blue border border-gray-200 dark:border-text-secondary-dark/20 rounded-xl p-4 animate-pulse">
      <div className="flex flex-col gap-1 mb-3">
        <div className="h-4 w-32 bg-gray-200 dark:bg-text-secondary-dark/20 rounded" />
        <div className="h-3 w-24 bg-gray-200 dark:bg-text-secondary-dark/20 rounded" />
      </div>

      <div className="h-4 w-3/4 bg-gray-200 dark:bg-text-secondary-dark/20 rounded mb-2" />

      <div className="flex flex-col gap-1.5">
        <div className="h-3 w-full bg-gray-200 dark:bg-text-secondary-dark/20 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 dark:bg-text-secondary-dark/20 rounded" />
        <div className="h-3 w-4/6 bg-gray-200 dark:bg-text-secondary-dark/20 rounded" />
      </div>

      <div className="flex items-center gap-2 mt-4">
        <div className="h-5 w-5 bg-gray-200 dark:bg-text-secondary-dark/20 rounded-full" />
        <div className="h-3 w-6 bg-gray-200 dark:bg-text-secondary-dark/20 rounded" />
      </div>
    </div>
  );
}
