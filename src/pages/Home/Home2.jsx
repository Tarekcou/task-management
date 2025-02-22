import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";

// Sample tasks for now (Replace with MongoDB later)
const initialTasks = [
  {
    id: "1",
    title: "Design UI Layout",
    description: "Plan out the homepage UI",
    category: "To-Do",
  },
  {
    id: "2",
    title: "Set up Firebase Auth",
    description: "Enable Google login",
    category: "To-Do",
  },
  {
    id: "3",
    title: "Connect MongoDB",
    description: "Setup database connection",
    category: "In Progress",
  },
  {
    id: "4",
    title: "Implement Drag and Drop",
    description: "Use @hello-pangea/dnd",
    category: "In Progress",
  },
  {
    id: "5",
    title: "Deploy App",
    description: "Push to Vercel",
    category: "Done",
  },
];

const categories = ["To-Do", "In Progress", "Done"];

const HomePage2 = () => {
  const [tasks, setTasks] = useState(initialTasks);

  // Handle Drag & Drop
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedTasks = [...tasks];
    const draggedTask = updatedTasks.find(
      (task) => task.id === result.draggableId
    );

    if (draggedTask) {
      draggedTask.category = categories[result.destination.droppableId];
      setTasks(updatedTasks);
    }
  };

  // Add New Task
  const addTask = (category) => {
    const title = prompt("Enter task title:");
    if (!title) return;

    const newTask = {
      id: Date.now().toString(),
      title,
      description: "",
      category,
    };
    setTasks([...tasks, newTask]);
  };

  // Edit Task
  const editTask = (id) => {
    const updatedTitle = prompt("Edit task title:");
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, title: updatedTitle || task.title } : task
      )
    );
  };

  // Delete Task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex md:flex-row flex-col gap-4 bg-gray-100 p-5 min-h-screen">
        {categories.map((category, index) => (
          <Droppable key={category} droppableId={String(index)}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex-1 bg-white shadow-md p-4 rounded-lg"
              >
                <h2 className="flex justify-between items-center mb-3 font-semibold text-lg">
                  {category}
                  <button
                    onClick={() => addTask(category)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <FaPlus />
                  </button>
                </h2>

                {tasks
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
                          className="flex justify-between items-center bg-gray-50 shadow mb-2 p-3 rounded-md"
                        >
                          <div>
                            <h3 className="font-medium">{task.title}</h3>
                            {task.description && (
                              <p className="text-gray-600 text-sm">
                                {task.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => editTask(task.id)}
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
  );
};

export default HomePage2;
