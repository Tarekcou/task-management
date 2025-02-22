import { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaPlus, FaTrash, FaEdit, FaInbox, FaFolder } from "react-icons/fa";
import AddEditTaskModal from "./AddEditTaskModal";
import axios from "axios";
import { AuthContext } from "../../provider/AuthProvider";

// const initialTasks = [
//   {
//     id: "1",
//     title: "Design UI Layout",
//     description: "Plan homepage UI",
//     category: "To-Do",
//   },
//   {
//     id: "2",
//     title: "Set up Firebase Auth",
//     description: "Enable Google login",
//     category: "To-Do",
//   },
//   {
//     id: "3",
//     title: "Connect MongoDB",
//     description: "Setup database connection",
//     category: "In Progress",
//   },
//   {
//     id: "4",
//     title: "Implement Drag and Drop",
//     description: "Use @hello-pangea/dnd",
//     category: "In Progress",
//   },
//   {
//     id: "5",
//     title: "Deploy App",
//     description: "Push to Vercel",
//     category: "Done",
//   },
// ];

const categories = ["To-Do", "In Progress", "Done"];

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [tasksByProject, setTasksByProject] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5005/projects"); // ✅ `await` added
        setProjects(response.data); // ✅ Now it correctly updates the state
        // console.log("Projects fetched:", response.data);
        // console.log("Projects fetched:", projects, response);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []); // ✅ Runs once when the component mounts

  // Fetch tasks when the page loads
  useEffect(() => {
    if (!selectedProject) return; // ✅ Prevents unnecessary calls
    console.log("Fetching tasks for project:", selectedProject);
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5005/tasks/${selectedProject}`
        );

        const tasks = response.data;
        const tasksGroupedByProject = tasks.reduce((acc, task) => {
          acc[task.project] = acc[task.project] || [];
          acc[task.project].push(task);
          return acc;
        }, {});

        console.log("Tasks fetched:", tasksGroupedByProject);
        setTasksByProject(tasksGroupedByProject);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [selectedProject]); // ✅ Runs whenever `selectedProject` changes

  const onDragEnd = async (result) => {
    if (!result.destination) return; // If dropped outside, do nothing

    const { source, destination, draggableId } = result;

    // Clone the tasks of the selected project
    const currentTasks = [...(tasksByProject[selectedProject] || [])];

    // Find the dragged task
    const draggedTaskIndex = currentTasks.findIndex(
      (task) => task.id === draggableId
    );
    if (draggedTaskIndex === -1) return; // Ensure task exists

    const draggedTask = { ...currentTasks[draggedTaskIndex] };

    // Remove the task from the original position
    currentTasks.splice(draggedTaskIndex, 1);

    // Change category if moved to a different category
    draggedTask.category = categories[destination.droppableId];

    // Insert the task at the new position
    currentTasks.splice(destination.index, 0, draggedTask);

    // Update state
    setTasksByProject((prev) => ({
      ...prev,
      [selectedProject]: currentTasks,
    }));

    // Update backend with new position and category
    try {
      await axios.put(`http://localhost:5005/tasks/${draggedTask.id}`, {
        category: draggedTask.category,
        position: destination.index, // Optionally store position
      });
      console.log("Task updated successfully");
    } catch (error) {
      console.error("Error updating task position:", error);
    }
  };

  const openTaskModal = (task = null) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  // Modify saveTask to sync with MongoDB

  const saveTask = async (newTask) => {
    try {
      if (newTask?._id) {
        // Update existing task
        await axios.put(`http://localhost:5005/tasks/${newTask._id}`, newTask);
      } else {
        // Create new task
        // console.log(newTask);
        const response = await axios.post(
          "http://localhost:5005/tasks",
          newTask
        );
        newTask.id = response.data.insertedId;
      }

      setTasksByProject((prevTasks) => {
        const projectTasks = prevTasks[selectedProject] || [];
        const existingTaskIndex = projectTasks.findIndex(
          (task) => task.id === newTask.id
        );

        if (existingTaskIndex !== -1) {
          projectTasks[existingTaskIndex] = newTask;
        } else {
          projectTasks.push(newTask);
        }

        return { ...prevTasks, [selectedProject]: projectTasks };
      });
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const deleteTask = (id) => {
    setTasksByProject((prevTasks) => ({
      ...prevTasks,
      [selectedProject]: prevTasks[selectedProject].filter(
        (task) => task.id !== id
      ),
    }));
  };

  const addProject = async () => {
    const projectName = prompt("Enter project name:");
    setProjects([...projects, projectName]);

    if (projectName && !projects.includes(projectName)) {
      try {
        const response = await axios.post("http://localhost:5005/projects", {
          name: projectName,
          email: user.email,
        });

        if (response.status === 201) {
          setProjects([...projects, projectName]);
          setTasksByProject({ ...tasksByProject, [projectName]: [] });
          setSelectedProject(projectName);
        }
      } catch (error) {
        console.error("Error adding project:", error);
        alert("Failed to add project. Try again.");
      }
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="flex flex-col gap-4 bg-gray-900 p-5 w-64 text-white">
        <h2 className="font-bold text-xl">Task Manager</h2>
        <button
          onClick={addProject}
          className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-md"
        >
          <FaPlus /> Add Project
        </button>
        <h3 className="mt-4 text-gray-400">My Projects</h3>
        <ul className="space-y-2">
          {projects.length > 0 &&
            projects.map((project, index) => (
              <li
                key={index}
                onClick={() => setSelectedProject(project.name)}
                className={`cursor-pointer p-2 rounded-md ${
                  selectedProject === project.name
                    ? "bg-blue-500"
                    : "hover:text-gray-300"
                }`}
              >
                <FaFolder /> {project.name}
              </li>
            ))}
        </ul>
      </aside>

      <div className="flex-1 bg-gray-100 p-5">
        {selectedProject ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex md:flex-row flex-col gap-4">
              {categories.map((category, index) => (
                <Droppable key={index} droppableId={String(index)}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 bg-white p-4 rounded-lg"
                    >
                      <h2 className="flex justify-between items-center mb-3 font-semibold text-black text-lg">
                        {category}
                        {category === "To-Do" && (
                          <button
                            onClick={() => openTaskModal()}
                            className="text-green-500 hover:text-green-700"
                          >
                            <FaPlus />
                          </button>
                        )}
                      </h2>
                      {(tasksByProject[selectedProject] || [])
                        .filter((task) => task.category === category)
                        .map((task, taskIndex) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={taskIndex}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="flex justify-between items-center bg-gray-50 shadow mb-2 p-3 rounded-md text-black"
                              >
                                <div>
                                  <h3 className="font-medium text-black">
                                    {task.title}
                                  </h3>
                                  {task.description && (
                                    <p className="text-gray-600 text-sm">
                                      {task.description}
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => openTaskModal(task)}
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => deleteTask(task.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        ) : (
          <div className="py-10 text-gray-500 text-center">
            Select a project to view tasks
          </div>
        )}
      </div>
      <AddEditTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveTask}
        task={editingTask}
        projects={projects}
        selectedProject={selectedProject}
      />
    </div>
  );
};

export default HomePage;
