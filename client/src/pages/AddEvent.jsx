import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

// Reusable Input Component
const InputField = ({ label, name, type = "text", value, onChange, placeholder = "", error }) => (
  <label htmlFor={name} className="flex flex-col text-gray-700 font-medium">
    {label}:
    <input
      id={name}
      type={type}
      name={name}
      placeholder={placeholder}
      className={`rounded mt-2 p-3 border ${error ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-sky-500 focus:outline-none`}
      value={value}
      onChange={onChange}
      aria-required="true"
      aria-invalid={!!error}
    />
    {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
  </label>
);

export default function AddEvent() {
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    owner: user ? user.name : "",
    title: "",
    optional: "",
    description: "",
    organizedBy: "",
    eventDate: "",
    eventTime: "",
    location: "",
    ticketPrice: 0,
    image: "",
    likes: 0,
  });

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = "Title is required.";
    if (!formData.eventDate) errors.eventDate = "Event date is required.";
    if (!formData.description) errors.description = "Description is required.";
    if (formData.image && formData.image.size > 2 * 1024 * 1024) {
      errors.image = "Image size must be under 2MB.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    axios
      .post("/createEvent", data, { headers: { "Content-Type": "multipart/form-data" } })
      .then((response) => {
        console.log("Event posted successfully:", response.data);
        setSuccessMessage("✅ Your event was successfully added!");
        resetForm();
      })
      .catch((error) => {
        console.error("Error posting event:", error);
        setSuccessMessage("❌ Failed to add your event. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  const resetForm = () => {
    setFormData({
      owner: user ? user.name : "",
      title: "",
      optional: "",
      description: "",
      organizedBy: "",
      eventDate: "",
      eventTime: "",
      location: "",
      ticketPrice: 0,
      image: "",
      likes: 0,
    });
    setFormErrors({});
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center py-10 px-5">
      <div className="bg-white shadow-md rounded-lg w-full max-w-3xl p-8">
        <h1 className="text-4xl font-extrabold text-sky-700 mb-6 text-center">Post Your Event</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" aria-label="Event submission form">
          <InputField label="Title" name="title" value={formData.title} onChange={handleChange} error={formErrors.title} />
          <InputField label="Optional" name="optional" value={formData.optional} onChange={handleChange} />
          
          <label htmlFor="description" className="flex flex-col text-gray-700 font-medium">
            Description:
            <textarea
              id="description"
              name="description"
              className={`rounded mt-2 p-3 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-sky-500 focus:outline-none`}
              value={formData.description}
              onChange={handleChange}
              aria-required="true"
              aria-invalid={!!formErrors.description}
            />
            {formErrors.description && <span className="text-red-500 text-sm mt-1">{formErrors.description}</span>}
          </label>

          <InputField label="Organized By" name="organizedBy" value={formData.organizedBy} onChange={handleChange} />
          <InputField label="Event Date" name="eventDate" type="date" value={formData.eventDate} onChange={handleChange} error={formErrors.eventDate} />
          <InputField label="Event Time" name="eventTime" type="time" value={formData.eventTime} onChange={handleChange} />
          <InputField label="Location" name="location" value={formData.location} onChange={handleChange} />
          <InputField label="Ticket Price" name="ticketPrice" type="number" value={formData.ticketPrice} onChange={handleChange} />

          <label htmlFor="image" className="flex flex-col text-gray-700 font-medium">
            Image:
            <input
              id="image"
              type="file"
              name="image"
              className={`rounded mt-2 p-3 border ${formErrors.image ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-sky-500 focus:outline-none`}
              onChange={handleChange}
              aria-label="Upload event image"
            />
            {formErrors.image && <span className="text-red-500 text-sm mt-1">{formErrors.image}</span>}
          </label>

          {formData.image && typeof formData.image !== "string" && (
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Event Preview"
              className="w-40 h-40 object-cover rounded border mt-2"
            />
          )}

          <button
            type="submit"
            className={`bg-sky-700 text-white font-bold py-3 px-6 rounded hover:bg-sky-800 transition text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {successMessage && (
          <div
            role="alert"
            className="text-center mt-6 text-lg font-semibold p-4 border rounded shadow-md bg-green-100 border-green-300 text-green-700"
          >
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}


// import { useContext, useState } from "react";
// import axios from "axios";
// import { UserContext } from "../UserContext";

// // Reusable Input Component
// const InputField = ({ label, name, type = "text", value, onChange, placeholder = "" }) => (
//   <label className="flex flex-col text-gray-700 font-medium">
//     {label}:
//     <input
//       type={type}
//       name={name}
//       placeholder={placeholder}
//       className="rounded mt-2 p-3 border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
//       value={value}
//       onChange={onChange}
//     />
//   </label>
// );

// export default function AddEvent() {
//   const { user } = useContext(UserContext);
//   const [formData, setFormData] = useState({
//     owner: user ? user.name : "",
//     title: "",
//     optional: "",
//     description: "",
//     organizedBy: "",
//     eventDate: "",
//     eventTime: "",
//     location: "",
//     ticketPrice: 0,
//     image: "",
//     likes: 0,
//   });
//   const [successMessage, setSuccessMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     setFormData((prevState) => ({ ...prevState, image: file }));
//   };

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setFormData((prevState) => ({ ...prevState, [name]: files[0] }));
//     } else {
//       setFormData((prevState) => ({ ...prevState, [name]: value }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     setLoading(true);
//     const data = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       data.append(key, value);
//     });
    
//     axios
//       .post("/createEvent", data, { headers: { "Content-Type": "multipart/form-data" } })
//       .then((response) => {
//         console.log("Event posted successfully:", response.data);
//         setSuccessMessage("Your event was successfully added!");
//         resetForm();
//       })
//       .catch((error) => {
//         console.error("Error posting event:", error);
//         setSuccessMessage("Failed to add your event. Please try again.");
//       })
//       .finally(() => setLoading(false));
//   };

//   const validateForm = () => {
//     if (!formData.title) {
//       alert("Title is required!");
//       return false;
//     }
//     if (!formData.eventDate) {
//       alert("Event date is required!");
//       return false;
//     }
//     if (!formData.description) {
//       alert("Description is required!");
//       return false;
//     }
//     if (formData.image && formData.image.size > 2 * 1024 * 1024) {
//       alert("Image size should not exceed 2MB.");
//       return false;
//     }
//     return true;
//   };
  
//   const resetForm = () => {
//     setFormData({
//       owner: user ? user.name : "",
//       title: "",
//       optional: "",
//       description: "",
//       organizedBy: "",
//       eventDate: "",
//       eventTime: "",
//       location: "",
//       ticketPrice: 0,
//       image: "",
//       likes: 0,
//     });
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen flex flex-col items-center py-10 px-5">
//       <div className="bg-white shadow-md rounded-lg w-full max-w-3xl p-8">
//         <h1 className="text-4xl font-extrabold text-sky-700 mb-6 text-center">Post Your Event</h1>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-6">
//           <InputField label="Title" name="title" value={formData.title} onChange={handleChange} />
//           <InputField label="Optional" name="optional" value={formData.optional} onChange={handleChange} />
//           <label className="flex flex-col text-gray-700 font-medium">
//             Description:
//             <textarea
//               name="description"
//               className="rounded mt-2 p-3 border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
//               value={formData.description}
//               onChange={handleChange}
//             />
//           </label>
//           <InputField label="Organized By" name="organizedBy" value={formData.organizedBy} onChange={handleChange} />
//           <InputField label="Event Date" name="eventDate" type="date" value={formData.eventDate} onChange={handleChange} />
//           <InputField label="Event Time" name="eventTime" type="time" value={formData.eventTime} onChange={handleChange} />
//           <InputField label="Location" name="location" value={formData.location} onChange={handleChange} />
//           <InputField label="Ticket Price" name="ticketPrice" type="number" value={formData.ticketPrice} onChange={handleChange} />
//           <label className="flex flex-col text-gray-700 font-medium">
//             Image:
//             <input
//               type="file"
//               name="image"
//               className="rounded mt-2 p-3 border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
//               onChange={handleImageUpload}
//             />
//           </label>
//           <button
//             className={`bg-sky-700 text-white font-bold py-3 px-6 rounded hover:bg-sky-800 transition text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? "Submitting..." : "Submit"}
//           </button>
//         </form>
//         {successMessage && (
//           <div className="text-center mt-6 text-lg font-semibold p-4 border rounded shadow-md bg-green-100 border-green-300 text-green-700">
//             {successMessage}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
