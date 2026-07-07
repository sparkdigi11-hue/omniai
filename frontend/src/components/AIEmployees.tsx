import { useEffect, useState } from "react";

type AIEmployee = {
  id: string;
  name: string;
  role: string;
  language: string;
  status: string;
};

export default function AIEmployees() {
  const [employees, setEmployees] = useState<AIEmployee[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    async function loadEmployees() {
      const response = await fetch("http://localhost:4000/ai-employees");
      const data = await response.json();
      setEmployees(data);
    }

    loadEmployees();
  }, []);
     async function createEmployee() {
        if (!name.trim() || !role || !language) {
  alert("Please fill in all fields.");
  return;
}
        
  const response = await fetch("http://localhost:4000/ai-employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      role,
      language,
    }),
  });

  const newEmployee = await response.json();

  setEmployees((prev) => [...prev, newEmployee]);

  setName("");
  setRole("");
  setLanguage("");
  setShowCreateForm(false);
}
  return (
    <div>
      <h1 className="text-3xl font-semibold">AI Employees</h1>
      <p className="mt-2 text-zinc-500">
        Manage your AI agents for calls, WhatsApp, support, and sales.
      </p>
      <button
  type="button"
  onClick={() => setShowCreateForm(true)}
  className="mt-6 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
>
  + Create AI Employee
</button>
{showCreateForm && (
  <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
    <h2 className="text-lg font-medium">Create AI Employee</h2>
    <input
  type="text"
  placeholder="Employee name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
/>

<select
  value={role}
  onChange={(e) => setRole(e.target.value)}
  className="mt-3 w-full rounded-xl border border-white/10 bg-[#18181b] p-3 text-white outline-none"
>
  <option value="">Select employee role</option>
  <option value="Order Confirmation">Order Confirmation</option>
  <option value="Sales">Sales</option>
  <option value="Customer Support">Customer Support</option>
  <option value="Follow-up">Follow-up</option>
</select>
<select
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  className="mt-3 w-full rounded-xl border border-white/10 bg-[#18181b] p-3 text-white outline-none"
>
  <option value="">Select employee language</option>
  <option value="Arabic">Arabic</option>
  <option value="French">French</option>
  <option value="English">English</option>
  <option value="Spanish">Spanish</option>
</select>
<button
  type="button"
  onClick={createEmployee}
  className="mt-4 w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black"
>
  Create Employee
</button>
  </div>
)}

      <div className="mt-8 grid grid-cols-3 gap-4">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
          >
            <h3 className="text-lg font-medium">{employee.name}</h3>
            <p className="mt-2 text-sm text-zinc-500">{employee.role}</p>
            <p className="mt-1 text-sm text-zinc-500">{employee.language}</p>

            <span className="mt-4 inline-flex rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
              {employee.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}