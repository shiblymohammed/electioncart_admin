interface PopularToggleButtonProps {
  isPopular: boolean;
  popularOrder?: number;
  onToggle: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function PopularToggleButton({
  isPopular,
  popularOrder,
  onToggle,
  disabled = false,
  loading = false
}: PopularToggleButtonProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Toggle Switch */}
      <button
        onClick={onToggle}
        disabled={disabled || loading}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-200 ease-in-out
          ${isPopular ? 'bg-green-500' : 'bg-gray-300'}
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}
        `}
        role="switch"
        aria-checked={isPopular}
        title={isPopular ? `Popular #${popularOrder} - Click to unmark` : 'Click to mark as popular'}
      >
        {loading ? (
          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out translate-x-1">
            <div className="w-full h-full border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </span>
        ) : (
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white
              transition duration-200 ease-in-out
              ${isPopular ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        )}
      </button>

      {/* Label */}
      <div className="flex items-center gap-2">
        {isPopular ? (
          <>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-200">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Popular #{popularOrder}
            </span>
          </>
        ) : (
          <span className="text-xs text-gray-500">
            {disabled ? 'Limit reached' : 'Not popular'}
          </span>
        )}
      </div>
    </div>
  );
}
