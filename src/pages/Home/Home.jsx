import { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaPlus, FaTrash, FaEdit, FaInbox, FaFolder } from "react-icons/fa";
import AddEditTaskModal from "./AddEditTaskModal";
import axios from "axios";
import { AuthContext } from "../../provider/AuthProvider";
import { useNavigate } from "react-router-dom";

const categories = ["To-Do", "In Progress", "Done"];

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [tasksByProject, setTasksByProject] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { user, logOut } = useContext(AuthContext);
  const [loading, setLoading, setUser] = useState(true);
  const navigate = useNavigate();
  const vercelBackend = "https://task-management-server-sigma-ten.vercel.app";
  useEffect(() => {
    const fetchProjects = async () => {
      // setLoading(true);

      try {
        const response = await axios.get(`${vercelBackend}/projects`, {
          params: { email: user.email },
        });
        setLoading(false);
        setProjects(response.data); // ✅ Now it correctly sets the projects
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        // setLoading(false);
      }
    };

    if (user?.email) {
      fetchProjects();
    }
  }, [user?.email]); // Only run when `user.email` changes
  // ✅ Runs once when the component mounts

  // Fetch tasks when the page loads
  useEffect(() => {
    if (!selectedProject) return; // ✅ Prevents unnecessary calls
    // setLoading(true);

    // console.log("Fetching tasks for project:", selectedProject);
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${vercelBackend}/tasks/${selectedProject}`,
          {
            params: { email: user.email },
          }
        );
        // const response = await axios.get(
        //   `https://task-management-server-sigma-ten.vercel.app/tasks/${selectedProject}`
        // );
        setLoading(false);
        const tasks = response.data;
        console.log(tasks);
        const tasksGroupedByProject = tasks.reduce((acc, task) => {
          acc[task.project] = acc[task.project] || [];
          acc[task.project].push(task);
          return acc;
        }, {});

        console.log("Tasks fetched:", tasksGroupedByProject);
        setTasksByProject(tasksGroupedByProject);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedProject]); // ✅ Runs whenever `selectedProject` changes

  const onDragEnd = async (result) => {
    if (!tasksByProject[selectedProject]) return;

    if (!result.destination) return; // If dropped outside, do nothing

    const { source, destination, draggableId } = result;

    const currentTasks = [...(tasksByProject[selectedProject] || [])];

    const draggedTaskIndex = currentTasks.findIndex(
      (task) => task._id === draggableId
    );
    if (draggedTaskIndex === -1) return;

    const draggedTask = { ...currentTasks[draggedTaskIndex] };

    currentTasks.splice(draggedTaskIndex, 1);

    // Change category based on destination.droppableId (which is now category name)
    draggedTask.category = destination.droppableId;

    currentTasks.splice(destination.index, 0, draggedTask);

    setTasksByProject((prev) => ({
      ...prev,
      [selectedProject]: currentTasks,
    }));

    // Update backend
    try {
      await axios.put(`${vercelBackend}/tasks/${draggedTask._id}`, {
        category: draggedTask.category,
        position: destination.index,
      });

      // Refetch updated tasks
      const response = await axios.get(
        `${vercelBackend}/tasks/${selectedProject}`,
        {
          params: { email: user.email },
        }
      );

      setTasksByProject((prev) => ({
        ...prev,
        [selectedProject]: response.data,
      }));

      console.log("Task updated and refetched successfully");
    } catch (error) {
      console.error("Error updating task position:", error);
    }
  };

  const openTaskModal = (task = null) => {
    // console.log(task);
    setEditingTask(task);
    setModalOpen(true);
  };

  // Modify saveTask to sync with MongoDB

  const saveTask = async (newTask) => {
    console.log(newTask);
    try {
      if (newTask?._id) {
        console.log("Updating task");
        // Update existing task
        await axios.put(`${vercelBackend}/tasks/${newTask._id}`, newTask);

        // Update the task in the state
        setTasksByProject((prevTasks) => ({
          ...prevTasks,
          [selectedProject]: prevTasks[selectedProject].map((task) =>
            task._id === newTask._id ? newTask : task
          ),
        }));
      } else {
        // Create new task
        console.log("create new");
        const response = await axios.post(`${vercelBackend}/tasks`, newTask);

        // Assign the newly generated ID from the backend
        const createdTask = { ...newTask, _id: response.data.insertedId };

        // Append new task to the project without overriding
        setTasksByProject((prevTasks) => ({
          ...prevTasks,
          [selectedProject]: [
            ...(prevTasks[selectedProject] || []),
            createdTask,
          ],
        }));
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      // Send DELETE request to backend
      await axios.delete(`${vercelBackend}/tasks/${id}`);

      // Update frontend state by filtering out the deleted task
      setTasksByProject((prevTasks) => ({
        ...prevTasks,
        [selectedProject]: prevTasks[selectedProject].filter(
          (task) => task._id !== id
        ),
      }));

      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleLogOut = () => {
    navigate("/");

    logOut();
  };

  const addProject = async () => {
    const projectName = prompt("Enter project name:");

    if (!projectName || projects.includes(projectName)) return;

    try {
      const response = await axios.post(`${vercelBackend}/projects`, {
        name: projectName,
        email: user.email,
      });

      if (response.status === 201) {
        setProjects((prevProjects) => [...prevProjects, { name: projectName }]);

        setTasksByProject((prevTasks) => ({ ...prevTasks, [projectName]: [] }));
        setSelectedProject(projectName);
      }
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project. Try again.");
    }
  };

  return (
    <div className="flex h-screen">
      <aside className="flex flex-col justify-between gap-4 bg-gray-900 p-5 w-44 md:w-64 text-white">
        <div>
          <h2 className="font-bold text-xl">Task Manager</h2>
          <button
            onClick={addProject}
            className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-md"
          >
            <FaPlus /> Add Project
          </button>
          <h3 className="mt-4 text-gray-300 text-xl">My Projects</h3>
          {loading ? (
            <p className="text-gray-400">Loading projects...</p>
          ) : (
            <ul className="space-y-2">
              {projects.map((project, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedProject(project.name)}
                  className={`cursor-pointer flex items-center gap-2 p-2 rounded-md ${
                    selectedProject === project.name
                      ? "bg-blue-500"
                      : "hover:text-gray-300"
                  }`}
                >
                  <FaFolder /> {project.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <img src="" alt="" />
          <h1>{user.displayName}</h1>
          <button
            className="text-white btn btn-error btn-sm"
            onClick={handleLogOut}
          >
            LogOut
          </button>
        </div>
      </aside>

      <div className="flex-1 bg-gray-100 p-5">
        {selectedProject ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex md:flex-row flex-col gap-4">
              {categories.map((category, index) => (
                <Droppable key={index} droppableId={category}>
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
                            key={task._id} // Use _id from Firebase
                            draggableId={task._id} // Ensure this matches _id, not id
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
                                  {task.timestamp && (
                                    <p className="text-gray-600 text-sm">
                                      {task.timestamp}
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
                                    onClick={() => deleteTask(task._id)}
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
