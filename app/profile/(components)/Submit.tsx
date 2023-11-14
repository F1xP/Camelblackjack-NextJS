export const Submit: React.FC<{ loading: boolean; text: string; loadingText: string }> = ({
  loading,
  text,
  loadingText,
}) => {
  return (
    <button
      disabled={loading}
      type="submit"
      className="w-56 disabled:opacity-25 disabled:cursor-not-allowed font-mono self-start py-2 px-10 text-lg border-2 border-secondary font-bold text-text rounded-md flex justify-center items-center hover:bg-secondary transition-all duration-300">
      {loading ? loadingText : text}
    </button>
  );
};
