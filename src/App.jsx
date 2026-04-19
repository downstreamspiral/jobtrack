import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import JobBoard from "./pages/JobBoard";
import AddJobModal from "./components/AddJobModal";
import JobDetailModal from "./components/JobDetailModal";
import { jobsApi } from "./api/jobs";
import { Toaster, toast } from "react-hot-toast";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobsApi.getAll();
      setJobs(data);
    } catch (err) {
      toast.error("Failed to load jobs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (jobData) => {
    try {
      const newJob = await jobsApi.create(jobData);
      setJobs((prev) => [newJob, ...prev]);
      toast.success("Job added successfully!");
      setShowAddModal(false);
    } catch (err) {
      toast.error("Failed to add job");
    }
  };

  const handleUpdateJob = async (id, updates) => {
    try {
      const updated = await jobsApi.update(id, updates);
      setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
      setSelectedJob(updated);
      toast.success("Job updated!");
    } catch (err) {
      toast.error("Failed to update job");
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await jobsApi.delete(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      setSelectedJob(null);
      toast.success("Job removed");
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#18181b", color: "#f4f4f5", border: "1px solid #3f3f46" },
        }}
      />
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        jobs={jobs}
        onAddJob={() => setShowAddModal(true)}
      />
      <main className="flex-1 overflow-y-auto">
        {activePage === "dashboard" ? (
          <Dashboard
            jobs={jobs}
            loading={loading}
            onSelectJob={setSelectedJob}
            onAddJob={() => setShowAddModal(true)}
          />
        ) : (
          <JobBoard
            jobs={jobs}
            loading={loading}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onSelectJob={setSelectedJob}
            onAddJob={() => setShowAddModal(true)}
            onUpdateJob={handleUpdateJob}
          />
        )}
      </main>

      {showAddModal && (
        <AddJobModal onClose={() => setShowAddModal(false)} onSave={handleAddJob} />
      )}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onUpdate={handleUpdateJob}
          onDelete={handleDeleteJob}
        />
      )}
    </div>
  );
}
