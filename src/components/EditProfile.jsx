import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills?.join(", ") || "");

  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    //Clear Errors
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
        
          about,
          skills: skills.split(",").map((s) => s.trim()),
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <>
      <div className="flex justify-center my-10">
        <div className="flex justify-center mx-10">
          {/* mainekia */}
          <div className="card bg-base-300 w-full max-w-lg shadow-xl">
  <div className="card-body items-center text-center">
    <div className="relative">
      <img
        src={photoUrl}
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-md"
      />
      {/* Optional icon over image */}
      {/* <div className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3z" />
        </svg>
      </div> */}
    </div>

    <h2 className="card-title mt-4">Edit Profile</h2>

    {/* Form Fields Start */}
    <div className="form w-full mt-4 space-y-4">
      <input
        type="text"
        value={firstName}
        className="input input-bordered w-full"
        placeholder="First Name"
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        value={lastName}
        className="input input-bordered w-full"
        placeholder="Last Name"
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="text"
        value={photoUrl}
        className="input input-bordered w-full"
        placeholder="Photo URL"
        onChange={(e) => setPhotoUrl(e.target.value)}
      />
      <input
        type="text"
        value={age}
        className="input input-bordered w-full"
        placeholder="Age"
        onChange={(e) => setAge(e.target.value)}
      />
      <input
        type="text"
        value={gender}
        className="input input-bordered w-full"
        placeholder="Gender"
        onChange={(e) => setGender(e.target.value)}
      />
      <input
        type="text"
        value={about}
        className="input input-bordered w-full"
        placeholder="About"
        onChange={(e) => setAbout(e.target.value)}
      />
      <input
        type="text"
        value={skills}
        className="input input-bordered w-full"
        placeholder="Skills (comma-separated)"
        onChange={(e) => setSkills(e.target.value)}
      />
    </div>
    {/* Form Fields End */}

    <p className="text-red-500 mt-2">{error}</p>
    <div className="card-actions justify-center mt-4">
      <button className="btn btn-primary" onClick={saveProfile}>
        Save Profile
      </button>
    </div>
  </div>
</div>

        </div>
        <UserCard
          user={{ firstName, lastName, photoUrl, age, gender, about }}
        />
      </div>
      {showToast && (
  <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
    <div className="alert alert-success shadow-lg bg-green-600 text-white px-6 py-3 rounded-lg transition duration-300 ease-in-out">
      <span>✅ Profile saved successfully!</span>
    </div>
  </div>
)}

    </>
  );
};
export default EditProfile;