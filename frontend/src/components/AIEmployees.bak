import { useEffect, useState } from "react";

type AIEmployee = {
  id: string;
  name: string;
  role: string;
  language: string;
  status: string;
  goal?: string | null;
  script?: string | null;
  rules?: string | null;
  tools?: string | null;
  knowledgeItemIds?: string | null;
};

type KnowledgeItem = {
  id: string;
  title: string;
  category: string;
};

const availableTools = [
  "Voice Calls",
  "WhatsApp",
  "Instagram",
  "Messenger",
  "Email",
  "Orders",
];

const availableRoles = [
  "Order Confirmation",
  "Sales",
  "Customer Support",
  "Follow-up",
];

const availableLanguages = [
  "Darija",
  "Arabic",
  "French",
  "English",
  "Spanish",
];

function parseStringArray(value?: string | null): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function AIEmployees() {
  const [employees, setEmployees] = useState<AIEmployee[]>([]);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [language, setLanguage] = useState("");
  const [goal, setGoal] = useState("");
  const [script, setScript] = useState("");
  const [rules, setRules] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [knowledgeItemIds, setKnowledgeItemIds] = useState<string[]>([]);

  const [selectedEmployee, setSelectedEmployee] =
    useState<AIEmployee | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editLanguage, setEditLanguage] = useState("");
  const [editGoal, setEditGoal] = useState("");
  const [editScript, setEditScript] = useState("");
  const [editRules, setEditRules] = useState("");
  const [editTools, setEditTools] = useState<string[]>([]);
  const [editKnowledgeItemIds, setEditKnowledgeItemIds] =
    useState<string[]>([]);

  useEffect(() => {
    async function loadEmployees() {
      try {
        const response = await fetch(
          "http://localhost:4000/ai-employees"
        );

        if (!response.ok) {
          throw new Error("Failed to load AI employees");
        }

        const data: AIEmployee[] = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error(error);
      }
    }

    async function loadKnowledgeItems() {
      try {
        const response = await fetch(
          "http://localhost:4000/knowledge"
        );

        if (!response.ok) {
          throw new Error("Failed to load knowledge items");
        }

        const data: KnowledgeItem[] = await response.json();
        setKnowledgeItems(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadEmployees();
    loadKnowledgeItems();
  }, []);

  async function createEmployee() {
    if (!name.trim() || !role || !language) {
      alert("Please fill in name, role, and language.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/ai-employees",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            role,
            language,
            goal,
            script,
            rules,
            tools: JSON.stringify(tools),
            knowledgeItemIds: JSON.stringify(knowledgeItemIds),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create employee");
      }

      const newEmployee: AIEmployee = await response.json();

      setEmployees((prev) => [newEmployee, ...prev]);

      setName("");
      setRole("");
      setLanguage("");
      setGoal("");
      setScript("");
      setRules("");
      setTools([]);
      setKnowledgeItemIds([]);
      setShowCreateForm(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create employee.");
    }
  }

  function openEditForm() {
    if (!selectedEmployee) return;

    setEditName(selectedEmployee.name);
    setEditRole(selectedEmployee.role);
    setEditLanguage(selectedEmployee.language);
    setEditGoal(selectedEmployee.goal ?? "");
    setEditScript(selectedEmployee.script ?? "");
    setEditRules(selectedEmployee.rules ?? "");

    setEditTools(
      parseStringArray(selectedEmployee.tools)
    );

    setEditKnowledgeItemIds(
      parseStringArray(selectedEmployee.knowledgeItemIds)
    );

    setIsEditing(true);
  }

  async function saveEmployeeChanges() {
    if (!selectedEmployee) return;

    if (!editName.trim() || !editRole || !editLanguage) {
      alert("Please fill in name, role, and language.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/ai-employees/${selectedEmployee.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editName.trim(),
            role: editRole,
            language: editLanguage,
            goal: editGoal,
            script: editScript,
            rules: editRules,
            tools: JSON.stringify(editTools),
            knowledgeItemIds: JSON.stringify(editKnowledgeItemIds),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update employee");
      }

      const updatedEmployee: AIEmployee = await response.json();

      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === updatedEmployee.id
            ? updatedEmployee
            : employee
        )
      );

      setSelectedEmployee(updatedEmployee);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update employee.");
    }
  }

  function closeDrawer() {
    setSelectedEmployee(null);
    setIsEditing(false);
  }
  async function deleteEmployee() {
  if (!selectedEmployee) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete "${selectedEmployee.name}"?`
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://localhost:4000/ai-employees/${selectedEmployee.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete employee");
    }

    setEmployees((prev) =>
      prev.filter(
        (employee) => employee.id !== selectedEmployee.id
      )
    );

    closeDrawer();
  } catch (error) {
    console.error(error);
    alert("Failed to delete employee.");
  }
}
  const activeEmployees = employees.filter(
  (employee) => employee.status === "Active"
).length;

const languagesCount = new Set(
  employees.map((employee) => employee.language)
).size;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">
            AI Employees
          </h1>

          <p className="mt-2 text-zinc-500">
            Manage your AI agents for calls, WhatsApp, support,
            and sales.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateForm((prev) => !prev)}
          className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200 sm:w-auto"
        >
          {showCreateForm
            ? "Close Form"
            : "+ Create AI Employee"}
        </button>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  {[
    ["Total Employees", employees.length],
    ["Active", activeEmployees],
    ["Languages", languagesCount],
    ["Knowledge Items", knowledgeItems.length],
  ].map(([title, value]) => (
    <div
      key={String(title)}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
    >
      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-semibold">
        {value}
      </p>
    </div>
  ))}
</div>
      {showCreateForm && (
        <div className="fixed right-0 top-0 z-50 h-screen w-full animate-in slide-in-from-right duration-300 overflow-y-auto border-l border-white/10 bg-[#121214] p-6 shadow-2xl sm:w-[520px]">
         <div className="mb-6 flex items-center justify-between">
  <div>
    <h2 className="text-2xl font-semibold">
      Create AI Employee
    </h2>

    <p className="mt-1 text-sm text-zinc-500">
      Create and configure a new AI employee.
    </p>
  </div>

  <button
    type="button"
    onClick={() => setShowCreateForm(false)}
    className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
  >
    Close
  </button>
</div>

          <input
            type="text"
            placeholder="Employee name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
          />

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="mt-3 w-full rounded-xl border border-white/10 bg-[#18181b] p-3 text-white outline-none"
          >
            <option value="">Select employee role</option>

            {availableRoles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="mt-3 w-full rounded-xl border border-white/10 bg-[#18181b] p-3 text-white outline-none"
          >
            <option value="">
              Select employee language
            </option>

            {availableLanguages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Employee goal"
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            className="mt-3 h-24 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
          />

          <textarea
            placeholder="Employee script"
            value={script}
            onChange={(event) => setScript(event.target.value)}
            className="mt-3 h-32 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
          />

          <textarea
            placeholder="Employee rules"
            value={rules}
            onChange={(event) => setRules(event.target.value)}
            className="mt-3 h-32 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
          />

          <div className="mt-4">
            <p className="mb-3 text-sm text-zinc-500">
              Tools & Channels
            </p>

            <div className="grid grid-cols-2 gap-3">
              {availableTools.map((tool) => (
                <label
                  key={tool}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                >
                  <input
                    type="checkbox"
                    checked={tools.includes(tool)}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setTools((prev) => [...prev, tool]);
                      } else {
                        setTools((prev) =>
                          prev.filter((item) => item !== tool)
                        );
                      }
                    }}
                  />

                  <span className="text-sm text-zinc-300">
                    {tool}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm text-zinc-500">
              Knowledge Base Access
            </p>

            <div className="space-y-3">
              {knowledgeItems.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No knowledge items available.
                </p>
              ) : (
                knowledgeItems.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                  >
                    <input
                      type="checkbox"
                      checked={knowledgeItemIds.includes(item.id)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setKnowledgeItemIds((prev) => [
                            ...prev,
                            item.id,
                          ]);
                        } else {
                          setKnowledgeItemIds((prev) =>
                            prev.filter((id) => id !== item.id)
                          );
                        }
                      }}
                    />

                    <div>
                      <p className="text-sm text-zinc-300">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {item.category}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
  <button
    type="button"
    onClick={() => setShowCreateForm(false)}
    className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-300 hover:bg-white/5"
  >
    Cancel
  </button>

  <button
    type="button"
    onClick={createEmployee}
    className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black hover:bg-zinc-200"
  >
    Create Employee
  </button>
</div>
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {employees.length === 0 ? (
         <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-zinc-500 md:col-span-2 xl:col-span-3">
            No AI employees yet.
          </div>
        ) : (
          employees.map((employee) => (
           <button
  key={employee.id}
  type="button"
  onClick={() => {
    setSelectedEmployee(employee);
    setIsEditing(false);
  }}
  className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
>
  <div className="flex items-start justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold text-white">
        {employee.name.charAt(0).toUpperCase()}
      </div>

      <div>
        <h3 className="text-lg font-medium text-white">
          {employee.name}
        </h3>

        <p className="mt-1 text-sm text-zinc-500">
          {employee.role}
        </p>
      </div>
    </div>

    <span className="inline-flex rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-400">
      {employee.status}
    </span>
  </div>

  <div className="mt-6 grid grid-cols-3 gap-3">
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs text-zinc-500">Language</p>

      <p className="mt-1 text-sm text-zinc-300">
        {employee.language}
      </p>
    </div>

    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs text-zinc-500">Channels</p>

      <p className="mt-1 text-sm text-zinc-300">
        {parseStringArray(employee.tools).length}
      </p>
    </div>
  </div>

  <div className="mt-5 flex flex-wrap gap-2">
    {parseStringArray(employee.tools).slice(0, 3).map((tool) => (
      <span
        key={tool}
        className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-400"
      >
        {tool}
      </span>
    ))}

    {parseStringArray(employee.tools).length > 3 && (
      <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-400">
        +{parseStringArray(employee.tools).length - 3}
      </span>
    )}
  </div>

  <p className="mt-5 text-xs text-zinc-600 transition group-hover:text-zinc-400">
    Click to view and edit
  </p>
</button>
          ))
        )}
      </div>

      {selectedEmployee && (
        <div className="fixed right-0 top-0 z-50 h-screen w-[460px] overflow-y-auto border-l border-white/10 bg-[#121214] p-6 shadow-2xl">
          <div className="mb-6 flex items-center gap-2">
            <button
              type="button"
              onClick={closeDrawer}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-zinc-300"
            >
              Close
            </button>

            {!isEditing && (
  <>
    <button
      type="button"
      onClick={openEditForm}
      className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-black"
    >
      Edit Employee
    </button>

    <button
      type="button"
      onClick={deleteEmployee}
      className="rounded-lg bg-red-500/15 px-3 py-1.5 text-sm font-medium text-red-400 hover:bg-red-500/25"
    >
      Delete Employee
    </button>
  </>
)}
          </div>

          {isEditing ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <h2 className="text-xl font-semibold">
                Edit Employee
              </h2>

              <input
                value={editName}
                onChange={(event) =>
                  setEditName(event.target.value)
                }
                placeholder="Employee name"
                className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
              />

              <select
                value={editRole}
                onChange={(event) =>
                  setEditRole(event.target.value)
                }
                className="mt-3 w-full rounded-xl border border-white/10 bg-[#18181b] p-3 text-white outline-none"
              >
                <option value="">
                  Select employee role
                </option>

                {availableRoles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select
                value={editLanguage}
                onChange={(event) =>
                  setEditLanguage(event.target.value)
                }
                className="mt-3 w-full rounded-xl border border-white/10 bg-[#18181b] p-3 text-white outline-none"
              >
                <option value="">
                  Select employee language
                </option>

                {availableLanguages.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <textarea
                value={editGoal}
                onChange={(event) =>
                  setEditGoal(event.target.value)
                }
                placeholder="Employee goal"
                className="mt-3 h-24 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
              />

              <textarea
                value={editScript}
                onChange={(event) =>
                  setEditScript(event.target.value)
                }
                placeholder="Employee script"
                className="mt-3 h-28 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
              />

              <textarea
                value={editRules}
                onChange={(event) =>
                  setEditRules(event.target.value)
                }
                placeholder="Employee rules"
                className="mt-3 h-28 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
              />

              <div className="mt-4">
                <p className="mb-3 text-sm text-zinc-500">
                  Tools & Channels
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {availableTools.map((tool) => (
                    <label
                      key={tool}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                    >
                      <input
                        type="checkbox"
                        checked={editTools.includes(tool)}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setEditTools((prev) => [
                              ...prev,
                              tool,
                            ]);
                          } else {
                            setEditTools((prev) =>
                              prev.filter(
                                (item) => item !== tool
                              )
                            );
                          }
                        }}
                      />

                      <span className="text-sm text-zinc-300">
                        {tool}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm text-zinc-500">
                  Knowledge Base Access
                </p>

                <div className="space-y-3">
                  {knowledgeItems.length === 0 ? (
                    <p className="text-sm text-zinc-500">
                      No knowledge items available.
                    </p>
                  ) : (
                    knowledgeItems.map((item) => (
                      <label
                        key={item.id}
                        className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                      >
                        <input
                          type="checkbox"
                          checked={editKnowledgeItemIds.includes(
                            item.id
                          )}
                          onChange={(event) => {
                            if (event.target.checked) {
                              setEditKnowledgeItemIds((prev) => [
                                ...prev,
                                item.id,
                              ]);
                            } else {
                              setEditKnowledgeItemIds((prev) =>
                                prev.filter(
                                  (id) => id !== item.id
                                )
                              );
                            }
                          }}
                        />

                        <div>
                          <p className="text-sm text-zinc-300">
                            {item.title}
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            {item.category}
                          </p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={saveEmployeeChanges}
                  className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold">
                {selectedEmployee.name}
              </h2>

              <p className="mt-2 text-zinc-500">
                {selectedEmployee.role}
              </p>

              <p className="mt-1 text-zinc-500">
                {selectedEmployee.language}
              </p>

              <div className="mt-6">
                <p className="text-sm text-zinc-500">
                  Goal
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-300">
                  {selectedEmployee.goal ||
                    "No goal configured."}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-sm text-zinc-500">
                  Script
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-300">
                  {selectedEmployee.script ||
                    "No script configured."}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-sm text-zinc-500">
                  Rules
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-300">
                  {selectedEmployee.rules ||
                    "No rules configured."}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-sm text-zinc-500">
                  Tools & Channels
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {parseStringArray(selectedEmployee.tools)
                    .length > 0 ? (
                    parseStringArray(selectedEmployee.tools).map(
                      (tool) => (
                        <span
                          key={tool}
                          className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300"
                        >
                          {tool}
                        </span>
                      )
                    )
                  ) : (
                    <p className="text-sm text-zinc-400">
                      No tools configured.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-zinc-500">
                  Knowledge Base Access
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {parseStringArray(
                    selectedEmployee.knowledgeItemIds
                  ).length > 0 ? (
                    parseStringArray(
                      selectedEmployee.knowledgeItemIds
                    ).map((itemId) => {
                      const item = knowledgeItems.find(
                        (knowledgeItem) =>
                          knowledgeItem.id === itemId
                      );

                      return (
                        <span
                          key={itemId}
                          className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300"
                        >
                          {item?.title ??
                            "Unknown Knowledge Item"}
                        </span>
                      );
                    })
                  ) : (
                    <p className="text-sm text-zinc-400">
                      No knowledge access configured.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}