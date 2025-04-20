import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { motion, AnimatePresence } from "framer-motion";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);

  const getFeed = async () => {
    if (feed && feed.length > 0) return;
    try {
      const res = await axios.get(BASE_URL + "/feed?limit=10", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error("Failed to fetch feed: ", err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed || !Array.isArray(feed)) {
    return <h1 className="flex justify-center my-10">Loading...</h1>;
  }

  if (feed.length === 0) {
    return <h1 className="flex justify-center my-10">No new users found!</h1>;
  }

  const handleSwipe = (direction) => {
    if (direction === "left" || direction === "right") {
      if (index < feed.length - 1) {
        setIndex((prev) => prev + 1);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-10 gap-4">
      <AnimatePresence>
        <motion.div
          key={feed[index]._id}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(event, info) => {
            if (info.offset.x < -100) {
              handleSwipe("left");
            } else if (info.offset.x > 100) {
              handleSwipe("right");
            }
          }}
        >
          <UserCard user={feed[index]} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Feed;
