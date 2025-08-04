// context/LikeContext.tsx
import { createContext, useContext, useState } from "react";

type LikeContextType = {
  likedVideos: string[];
  toggleLiked: (videoId: string) => void;
};

const LikeContext = createContext<LikeContextType>({
  likedVideos: [],
  toggleLiked: () => {},
});

export const LikeProvider = ({ children }: { children: React.ReactNode }) => {
  const [likedVideos, setLikedVideos] = useState<string[]>([]);

  const toggleLiked = (videoId: string) => {
    setLikedVideos(prev =>
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  return (
    <LikeContext.Provider value={{ likedVideos, toggleLiked }}>
      {children}
    </LikeContext.Provider>
  );
};

export const useLike = () => useContext(LikeContext);
