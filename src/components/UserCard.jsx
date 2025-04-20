import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    age,
    gender,
    about,
    skills,
  } = user || {};
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  if (!user || !_id) return null;

  return (
    <div className="card bg-base-300 w-[280px] h-[450px] shadow-xl overflow-hidden">
      <figure className="h-[250px]">
        <img
          src={photoUrl}
          alt="photo"
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-base">{firstName + " " + lastName}</h2>
        {age && gender && <p className="text-sm">{age + ", " + gender}</p>}
        <p className="text-sm line-clamp-2">{about}</p>

        {/* Skills Section */}
        {user.skills && user.skills.length > 0 && (
  <div className="mt-2">
    <h3 className="font-semibold">Skills:</h3>
    <ul className="list-disc list-inside">
      {user.skills.map((skill, index) => (
        <li key={index}>{skill}</li>
      ))}
    </ul>
  </div>
)}


        <div className="card-actions justify-center mt-auto">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            disabled={!_id}
            className="btn btn-sm btn-secondary"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
