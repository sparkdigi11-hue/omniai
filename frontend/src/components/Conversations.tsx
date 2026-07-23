import { useEffect, useState } from "react";

type Message = {
  id: string;
  sender: string;
  content: string;
};



type ConversationEvent = {
  id: string;
  type: string;
  title: string;
  description?: string;
  createdAt: string;
};

type Conversation = {
  id: string;
  order: {
    product: string;
    status: string;
    customer: {
      name: string;
      phone?: string;
      city?: string;
      aiSummary?: string |null;
      aiInsights?: string | null;
    };
    events: ConversationEvent[];
  };
  messages: Message[];
};


function getEventStyle(title: string) {
  const value = title.toLowerCase();

  if (value.includes("customer")) {
    return {
      color: "border-blue-500",
      dot: "bg-blue-500",
      icon: "👤",
    };
  }

  if (value.includes("owner")) {
    return {
      color: "border-emerald-500",
      dot: "bg-emerald-500",
      icon: "💬",
    };
  }

  if (value.includes("ai")) {
    return {
      color: "border-violet-500",
      dot: "bg-violet-500",
      icon: "🤖",
    };
  }

  if (value.includes("status")) {
    return {
      color: "border-amber-500",
      dot: "bg-amber-500",
      icon: "✅",
    };
  }

  return {
    color: "border-zinc-500",
    dot: "bg-zinc-500",
    icon: "📌",
  };
}
export default function Conversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          "http://localhost:4000/conversations"
        );

        if (!response.ok) {
          throw new Error("Failed to load conversations");
        }

        const data: Conversation[] = await response.json();

        setConversations(data);

        if (data.length > 0) {
          setSelected(data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, []);

  async function sendOwnerMessage() {
    if (!selected || !message.trim() || sending) return;

    try {
      setSending(true);

      const response = await fetch(
        `http://localhost:4000/conversations/${selected.id}/messages/owner`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: message.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const newMessage: Message = await response.json();

      const updatedConversation: Conversation = {
        ...selected,
        messages: [...selected.messages, newMessage],
      };

      setSelected(updatedConversation);

      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === selected.id
            ? updatedConversation
            : conversation
        )
      );

      setMessage("");
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  }

  return (
<div className="grid h-[80vh] grid-cols-[260px_minmax(0,1fr)_340px] overflow-hidden rounded-3xl border border-white/10 bg-[#101011]">      <div className="overflow-y-auto border-r border-white/10">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            onClick={() => setSelected(conversation)}
            className={`w-full border-b border-white/5 p-4 text-left transition hover:bg-white/5 ${
              selected?.id === conversation.id
                ? "bg-white/10"
                : ""
            }`}
          >
            <h3 className="font-medium">
              {conversation.order.customer.name}
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              {conversation.order.product}
            </p>

            <p className="mt-2 text-xs text-zinc-400">
              {conversation.order.status}
            </p>
          </button>
        ))}
      </div>

      {!selected ? (
        <div className="col-span-2 flex items-center justify-center text-zinc-500">
          No conversation selected.
        </div>
      ) : (
        <>
          <div className="flex min-h-0 flex-col">
            <div className="border-b border-white/10 px-6 py-5">
              <h2 className="text-2xl font-semibold">
                {selected.order.customer.name}
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {selected.order.product} · {selected.order.status}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {selected.messages.map((conversationMessage) => {
                  const isCustomer =
                    conversationMessage.sender === "CUSTOMER";

                  const isOwner =
                    conversationMessage.sender === "OWNER";

                  return (
                    <div
                      key={conversationMessage.id}
                      className={`flex ${
                        isCustomer
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                          isCustomer
                            ? "bg-[#27272a] text-white"
                            : isOwner
                            ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-50"
                            : "bg-white text-black"
                        }`}
                      >
                        <p
                          className={`mb-1 text-xs ${
                            isCustomer
                              ? "text-zinc-400"
                              : isOwner
                              ? "text-emerald-400"
                              : "text-zinc-500"
                          }`}
                        >
                          {isCustomer
                            ? "Customer"
                            : isOwner
                            ? "You"
                            : "OmniAI"}
                        </p>

                        <p className="whitespace-pre-wrap text-sm leading-6">
                          {conversationMessage.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-white/10 p-4">
              <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey
                    ) {
                      event.preventDefault();
                      sendOwnerMessage();
                    }
                  }}
                  placeholder="Write a message..."
                  rows={1}
                  className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-zinc-500"
                />

                <button
                  type="button"
                  onClick={sendOwnerMessage}
                  disabled={!message.trim() || sending}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>

          <aside className="overflow-y-auto border-l border-white/10 bg-[#0d0d0f] p-6">
  <h3 className="text-lg font-semibold text-white">
    AI Timeline
  </h3>

  <p className="mt-1 text-sm text-zinc-500">
    Complete history of this conversation.
  </p>
<div className="mt-8">
  <div className="space-y-8">
    {selected.order.events
      .slice()
      .reverse()
      .map((event) => {
        const style = getEventStyle(event.title);

        return (
          <div key={event.id} className="relative pl-8">
            <div className="absolute left-[7px] top-6 h-full w-px bg-white/10" />

            <div
              className={`absolute left-0 top-1 h-4 w-4 rounded-full border-2 ${style.color} bg-[#0d0d0f]`}
            />

            <p className="text-xs text-zinc-500">
              {new Date(event.createdAt).toLocaleString()}
            </p>

            <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.05]">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
                <span>{style.icon}</span>
                {event.title}
              </h4>

              {event.description && (
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
  </div>
</div>
          </aside>
        </>
      )}
    </div>
  );
}