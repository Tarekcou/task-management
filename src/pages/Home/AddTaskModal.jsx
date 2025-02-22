import { useState } from "react";
import { Modal, Button, Input, Textarea, Select } from "@/components/ui";

const AddTaskModal = ({
  isOpen,
  onClose,
  onSave,
  projects,
  selectedProject,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("To-Do");
  const [project, setProject] = useState(projects[0]?.id || "");

  const handleSave = () => {
    if (!title.trim()) return;
    const newTask = {
      title,
      description,
      category,
      selectedProject,
      timestamp: new Date().toISOString(),
    };
    onSave(newTask);
    setTitle("");
    setDescription("");
    setCategory("To-Do");
    setProject(projects[0]?.id || "");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2 className="mb-4 font-semibold text-xl">Add New Task</h2>
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={50}
          required
        />
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
        />
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </Select>
        <Select
          label="Project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        >
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.name}
            </option>
          ))}
        </Select>
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="primary">
            Add Task
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddTaskModal;
