import React from "react";
import { Sidebar } from "./components/Sidebar";
import { Home } from "./pages/Home";
import { Feed } from "./pages/Feed";
import { Messages } from "./pages/Messages";
import  Profile  from "./pages/Profile";
import Documents from "./pages/Documents";
import { companiesSeed, postsSeed, conversationsSeed } from "./data/seed";
import { ContractorsPage } from "./pages/ConstractorPage";
import { StartupInvestorPage } from "./pages/StartupInvestorPage";

export const App: React.FC = () => {
  const [route, setRoute] = React.useState<string>("home");
  const [companies] = React.useState(companiesSeed);
  const [posts, setPosts] = React.useState(postsSeed);
  const [conversations, setConversations] = React.useState(conversationsSeed);
  const [activeConvId, setActiveConvId] = React.useState(conversationsSeed[0]?.id ?? "");

  function handleContact(id: string) {
    setRoute("messages");
    const convId = `c-${id}`;

    setConversations((prev) => {
      const exists = prev.find((c) => c.id === convId);
      if (exists) return prev;
      const company = companies.find((x) => x.id === id);
      return [...prev, { id: convId, title: company?.leader || 'Контакт', subtitle: company ? `${company.type}` : undefined, unread: 0, messages: [] }];
    });

    setActiveConvId(convId);
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Sidebar route={route} onNavigate={setRoute} />
      {/* <div className="ml-72 p-4 border-b bg-white flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button className="px-3 py-2 rounded border" onClick={() => setRoute('home')}>🔍 Лупа (Глобальный поиск)</button>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Профиль — Касым Петров</div>
        </div>
      </div> */}

      <main className="ml-64 p-4">
        {route === "home" && (
          <Home
            companies={companies}
            onContact={handleContact}
            onNavigate={setRoute}
          />
        )}

        {route === "contractors" && (
          <ContractorsPage
            services={companies.filter((c) => c.type === "service" || c.type === "executor")}
            contractors={companies.filter((c) => c.type === "contractor")}
            onContact={handleContact}
            onBack={() => setRoute("home")} // <- ВОТ функционал назад
          />
        )}

        {route === "startup-investor" && (
          <StartupInvestorPage
            startups={companies.filter((c) => c.type === "startup")}
            investors={companies.filter((c) => c.type === "investor")}
            onContact={handleContact}
            onBack={() => setRoute("home")} // <- возвращаем на Home
          />
        )}

        {route === 'feed' && (
          <Feed posts={posts} onCreate={(text) =>
            setPosts((s) => [
              { id: Date.now(), author: "Вы", time: "только что", text, likes: 0, comments: 0 },
              ...s
            ])
          } />
        )}
        {route === 'messages' && (
          <Messages conversations={conversations} activeId={activeConvId} setActiveId={setActiveConvId} />
        )}
        {route === 'profile' && <Profile />}
        {route === 'docs' && <Documents />}
      </main>
    </div>
  );
};
