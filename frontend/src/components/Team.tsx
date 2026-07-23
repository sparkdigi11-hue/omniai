import { useState } from "react";
import {
  Bot,
  CheckCircle2,
  Mail,
  Phone,
  Plus,
  Save,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

type Member = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Pending";
};

export default function Team() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: "Admin",
      email: "admin@omniai.com",
      role: "Owner",
      status: "Active",
    },
    {
      id: 2,
      name: "Sales Manager",
      email: "sales@company.com",
      role: "Manager",
      status: "Active",
    },
  ]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Agent");
  const [saved, setSaved] = useState(false);

  function addMember() {
    if (!name.trim() || !email.trim()) return;

    setMembers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        email,
        role,
        status: "Pending",
      },
    ]);

    setName("");
    setEmail("");
    setRole("Agent");
  }

  function removeMember(id: number) {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  }

  function saveTeam() {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <div>
      <p className="text-sm text-zinc-500">Workspace</p>

      <h2 className="mt-3 text-3xl font-semibold tracking-tight">
        Team Management
      </h2>

      <p className="mt-2 text-sm text-zinc-500">
        Invite teammates and manage access to your OmniAI workspace.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Users size={20} />
            <h3 className="font-medium">Team Members</h3>
          </div>

          <div className="mt-6 space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-2xl border border-white/10 p-4"
              >
                <div>
                  <p className="font-medium">{member.name}</p>

                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-2">
                      <Mail size={14} />
                      {member.email}
                    </span>

                    <span>{member.role}</span>

                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        member.status === "Active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeMember(member.id)}
                  className="rounded-xl p-2 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <UserPlus size={20} />
            <h3 className="font-medium">Invite Member</h3>
          </div>

          <div className="mt-6 space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#121214] px-4 py-3 outline-none"
            >
              <option>Agent</option>
              <option>Manager</option>
              <option>Admin</option>
            </select>

            <button
              onClick={addMember}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-black"
            >
              <Plus size={16} />
              Invite Member
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <Shield className="mb-3 text-green-400" />
          <p className="font-medium">Roles & Permissions</p>
          <p className="mt-2 text-sm text-zinc-500">
            Control access for each team member.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <Bot className="mb-3 text-violet-400" />
          <p className="font-medium">AI Employees</p>
          <p className="mt-2 text-sm text-zinc-500">
            Assign AI agents to different teammates.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <Phone className="mb-3 text-blue-400" />
          <p className="font-medium">Call Access</p>
          <p className="mt-2 text-sm text-zinc-500">
            Decide who can start and monitor AI calls.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={saveTeam}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-black"
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? "Saved" : "Save Team"}
        </button>
      </div>
    </div>
  );
}