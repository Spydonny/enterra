import React from "react";
import { Sidebar } from "./components/Sidebar";
import { Home } from "./pages/Home";
import { Feed } from "./pages/Feed";
import { Messages } from "./pages/Messages";
import ProfilePage from "./pages/Profile";
import Documents from "./pages/Documents";
import { companiesSeed, postsSeed, conversationsSeed } from "./data/seed";
import { ContractorsPage } from "./pages/ConstractorPage";
import { StartupInvestorPage } from "./pages/StartupInvestorPage";

export const App: React.FC = () => {
  const [route, setRoute] = React.useState<string>("home");

  const [companies] = React.useState(companiesSeed);
  const [posts, setPosts] = React.useState(postsSeed);
  const [conversations, setConversations] = React.useState(conversationsSeed);
  const [activeConvId, setActiveConvId] = React.useState(
    conversationsSeed[0]?.id ?? ""
  );

  const [selectedCompany, setSelectedCompany] = React.useState<any>(null);

  function openProfile(company: any) {
    setSelectedCompany(company);
    setRoute("profile");
  }

  function handleContact(id: string) {
    setRoute("messages");

    const convId = `c-${id}`;

    setConversations((prev) => {
      const exists = prev.find((c) => c.id === convId);
      if (exists) return prev;

      const company = companies.find((x) => x.id === id);
      return [
        ...prev,
        {
          id: convId,
          title: company?.leader || "Контакт",
          subtitle: company ? `${company.type}` : undefined,
          unread: 0,
          messages: [],
        },
      ];
    });

    setActiveConvId(convId);
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Sidebar route={route} onNavigate={setRoute} />

      <main className="ml-64 p-0">
        {route === "home" && (
          <Home
            companies={companies}
            onContact={handleContact}
            onNavigate={setRoute}
            onOpenProfile={openProfile}
          />
        )}

        {route === "contractors" && (
          <ContractorsPage
            services={companies.filter(
              (c) => c.type === "service" || c.type === "executor"
            )}
            contractors={companies.filter((c) => c.type === "contractor")}
            onContact={handleContact}
            onBack={() => setRoute("home")}
          />
        )}

        {route === "startup-investor" && (
          <StartupInvestorPage
            startups={companies.filter((c) => c.type === "startup")}
            investors={companies.filter((c) => c.type === "investor")}
            onContact={handleContact}
            onBack={() => setRoute("home")}
          />
        )}

        {route === "feed" && (
          <Feed
            posts={posts}
            onCreate={(text) =>
              setPosts((s) => [
                {
                  id: Date.now(),
                  author: "Вы",
                  time: "только что",
                  text,
                  likes: 0,
                  comments: 0,
                },
                ...s,
              ])
            }
          />
        )}

        {route === "messages" && (
          <Messages
            conversations={conversations}
            activeId={activeConvId}
            setActiveId={setActiveConvId}
          />
        )}

        {route === "profile" && (
          <ProfilePage
            company={selectedCompany}
            onMessage={(id: string) => handleContact(id)}
            isYourSelf={false}
          />
        )}

        {route === "docs" && <Documents />}
      </main>
    </div>
  );
};
