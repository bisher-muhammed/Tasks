import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../store/taskSlice";
import TaskList from "../components/TaskList";
import AddTask from "../components/AddTask";
import TaskStatistics from "../components/TaskStatics";
import { LoadingSpinner } from "../components/LoadingSpinner";

function Home() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-red-500 text-center p-4 bg-gray-100">
        <p className="font-semibold">Oops! Something went wrong.</p>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Task Management Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: AddTask and TaskList */}
        <div className="space-y-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Task</h2>
            <AddTask />
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Task List</h2>
            <div className="overflow-auto h-[400px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <TaskList />
            </div>
          </div>
        </div>

        {/* Right Column: TaskStatistics */}
        <div className="bg-white shadow-lg rounded-lg p-6 lg:sticky lg:top-4 h-fit">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Task Statistics</h2>
          <TaskStatistics />
        </div>
      </div>
    </div>
  );
}

export default Home;
