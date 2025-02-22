import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../provider/AuthProvider";

const AddEditTaskModal = ({
  isOpen,
  onClose,
  onSave,
  task,
  projects,
  selectedProject,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("To-Do");
  const [project, setProject] = useState(projects[0]?.id || "");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setCategory(task.category);
      setProject(task.project);
    } else {
      setTitle("");
      setDescription("");
      setCategory("To-Do");
      setProject(selectedProject || "");
    }
  }, [task, projects]);

  const handleSave = async () => {
    if (!title.trim() || title.length > 50) {
      alert("Title is required and must be under 50 characters.");
      return;
    }
    if (description.length > 200) {
      alert("Description must be under 200 characters.");
      return;
    }

    const newTask = {
      title,
      description,
      category,
      project: selectedProject,
      timestamp: task?.timestamp || new Date().toISOString(),
      email: user.email,
    };

    try {
      setLoading(true);
      // if (task) {
      //   // Update Task (PUT request)
      //   await axios.put(`http://localhost:5005/tasks/${task.id}`, newTask);
      // } else {
      //   // Create Task (POST request)
      //   await axios.post("http://localhost:5005/tasks", newTask);
      // }

      onSave(newTask); // Update UI
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50">
      <div className="bg-white shadow-md p-5 rounded-md w-96 text-black">
        <h2 className="mb-4 font-semibold text-xl">
          {task ? "Edit Task" : "Add New Task"}
        </h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={50}
          required
          className="mb-2 p-2 border rounded w-full"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
          className="mb-2 p-2 border rounded w-full"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
        >
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <select
          value={selectedProject}
          onChange={(e) => setProject(e.target.value)}
          className="mb-2 p-2 border rounded w-full text-black"
        >
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="bg-gray-400 px-4 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`bg-blue-500 px-4 py-2 rounded text-white ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : task ? "Update Task" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditTaskModal;
