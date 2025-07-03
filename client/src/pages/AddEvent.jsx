import { useContext, useRef } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Loader from '../components/Loader';
import Input from '../components/Input';
import { toast } from 'react-toastify';

const EventSchema = Yup.object().shape({
  title: Yup.string().required('Title is required.'),
  eventDate: Yup.string().required('Event date is required.'),
  description: Yup.string().required('Description is required.'),
  image: Yup.mixed()
    .test('fileSize', 'Image size must be under 2MB.', value => {
      if (!value) return true;
      return value.size <= 2 * 1024 * 1024;
    })
});

export default function AddEvent() {
  const { user, loading: userLoading } = useContext(UserContext);
  const fileInputRef = useRef();

  const initialValues = {
    owner: user ? user.name : "",
    title: "",
    optional: "",
    description: "",
    organizedBy: "",
    eventDate: "",
    eventTime: "",
    location: "",
    ticketPrice: 0,
    image: null,
    likes: 0,
  };

  const handleImageReset = (setFieldValue) => {
    setFieldValue('image', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center py-10 px-5">
      <div className="bg-white shadow-md rounded-lg w-full max-w-3xl p-8">
        <h1 className="text-4xl font-extrabold text-sky-700 mb-6 text-center">Post Your Event</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={EventSchema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting, resetForm, setFieldValue }) => {
            setSubmitting(true);
            const data = new FormData();
            Object.entries(values).forEach(([key, value]) => {
              data.append(key, value);
            });
            try {
              await axios.post("/createEvent", data, { headers: { "Content-Type": "multipart/form-data" } });
              toast.success("✅ Your event was successfully added!");
              resetForm();
              if (fileInputRef.current) fileInputRef.current.value = '';
            } catch (error) {
              toast.error("❌ Failed to add your event. Please try again.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form className="flex flex-col gap-6" aria-label="Event submission form">
              <Input label="Owner" name="owner" value={user ? user.name : ''} disabled required />
              <Input label="Title" name="title" value={values.title} onChange={e => setFieldValue('title', e.target.value)} error={touched.title && errors.title} required />
              <Input label="Optional" name="optional" value={values.optional} onChange={e => setFieldValue('optional', e.target.value)} />
              <label htmlFor="description" className="flex flex-col text-gray-700 font-medium">
                Description:
                <Field as="textarea"
                  id="description"
                  name="description"
                  className={`rounded mt-2 p-3 border ${touched.description && errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-sky-500 focus:outline-none`}
                  aria-required="true"
                  aria-invalid={!!(touched.description && errors.description)}
                />
                <ErrorMessage name="description" component="span" className="text-red-500 text-sm mt-1" />
              </label>
              <Input label="Organized By" name="organizedBy" value={values.organizedBy} onChange={e => setFieldValue('organizedBy', e.target.value)} />
              <Input label="Event Date" name="eventDate" type="date" value={values.eventDate} onChange={e => setFieldValue('eventDate', e.target.value)} error={touched.eventDate && errors.eventDate} required />
              <Input label="Event Time" name="eventTime" type="time" value={values.eventTime} onChange={e => setFieldValue('eventTime', e.target.value)} />
              <Input label="Location" name="location" value={values.location} onChange={e => setFieldValue('location', e.target.value)} />
              <Input label="Ticket Price" name="ticketPrice" type="number" value={values.ticketPrice} onChange={e => setFieldValue('ticketPrice', e.target.value)} />
              <label htmlFor="image" className="flex flex-col text-gray-700 font-medium">
                Image:
                <input
                  id="image"
                  type="file"
                  name="image"
                  ref={fileInputRef}
                  className={`rounded mt-2 p-3 border ${touched.image && errors.image ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-sky-500 focus:outline-none`}
                  onChange={e => setFieldValue('image', e.target.files[0])}
                  aria-label="Upload event image"
                />
                <ErrorMessage name="image" component="span" className="text-red-500 text-sm mt-1" />
                {values.image && typeof values.image !== "string" && (
                  <div className="flex items-center gap-4 mt-2">
                    <img
                      src={URL.createObjectURL(values.image)}
                      alt="Event Preview"
                      className="w-40 h-40 object-cover rounded border"
                    />
                    <button
                      type="button"
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                      onClick={() => handleImageReset(setFieldValue)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </label>
              <button
                type="submit"
                className={`bg-sky-700 text-white font-bold py-3 px-6 rounded hover:bg-sky-800 transition text-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader small /> : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
