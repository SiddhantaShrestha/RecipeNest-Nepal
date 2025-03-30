import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites);
  const favoriteCount = favorites?.length || 0;

  if (favoriteCount <= 0) return null;

  return (
    <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-pink-500 text-white text-xs font-bold rounded-full shadow-md animate-pulse">
      {favoriteCount}
    </span>
  );
};

export default FavoritesCount;
