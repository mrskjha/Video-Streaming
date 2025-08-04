import { useLike } from "@/contexts/likeContext";
import axios from "axios";

import { useEffect, useState } from "react";

type LikeButtonProps = {
  videoId: string;
  initialLiked: boolean;
  initialLikes: number;
};

const LikeButton = ({ videoId, initialLiked, initialLikes }: LikeButtonProps) => {
  const { likedVideos, toggleLiked } = useLike();
  const [likes, setLikes] = useState(initialLikes);

  const liked = likedVideos.includes(videoId);

  useEffect(() => {
    if (initialLiked && !liked) {
      toggleLiked(videoId);
    }
  }, []);

  const handleLike = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/v1/like/${videoId}`,
        { like: !liked },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setLikes(response.data.data.likes);
      toggleLiked(videoId);
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  return (
    // <button onClick={handleLike}>
    //   {liked ? `❤️ ${likes}` : `🤍 ${likes}`}
    // </button>
    <>
      
      <button className="btn" onClick={handleLike}>
        
        <span>{liked ? `❤️ ${likes}` : `🤍 ${likes}`}</span>
      </button>
      </>
  );
};

export default LikeButton;
