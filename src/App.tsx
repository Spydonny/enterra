import React from "react";
import { Sidebar } from "./components/Sidebar";
import { Home } from "./pages/Home";
import { Feed } from "./pages/Feed";
import { Messages } from "./pages/Messages";
import { ProfilePage } from "./pages/Profile";
import { MyCompanyProfilePage } from "./pages/MyProfilePage";
import Documents from "./pages/Documents";
import { companiesSeed, postsSeed, conversationsSeed } from "./data/seed";
import { ContractorsPage } from "./pages/ConstractorPage";
import { StartupInvestorPage } from "./pages/StartupInvestorPage";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { CreateCompany } from "./pages/auth/CreateCompanies";

import { getMe } from "./data/api/user.api";

export const App: React.FC = () => {
  const [route, setRoute] = React.useState<string>("login");
  const [isAuth, setIsAuth] = React.useState<boolean | null>(null);
  const [hasCompany, setHasCompany] = React.useState(false);

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

  React.useEffect(() => {
  async function checkAuth() {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setIsAuth(false);
      return;
    }

    try {
      await getMe();

      setIsAuth(true);
      setHasCompany(true); // или me.company !== null
      setRoute("home");
    } catch (e) {
      localStorage.removeItem("access_token");
      setIsAuth(false);
    }
  }

  checkAuth();
}, []);

  if (isAuth === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        Загрузка...
      </div>
    );
  }

  if (!isAuth) {
    if (route === "register") {
      return (
        <Register
          onSuccess={() => setRoute("create-company")}
          onGoLogin={() => setRoute("login")}
        />
      );
    }

    if (route === "create-company") {
      return (
        <CreateCompany
          onSuccess={() => {
            setHasCompany(true);
            setIsAuth(true);
            setRoute("home");
          }}
        />
      );
    }

    return (
      <Login
        onSuccess={() => {
          setIsAuth(true);

          if (!hasCompany) {
            setRoute("create-company");
          } else {
            setRoute("home");
          }
        }}
        onGoRegister={() => setRoute("register")}
      />
    );
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

        {route === "profile-me" && (
          <MyCompanyProfilePage />
        )}

        {route === "docs" && <Documents />}
      </main>
    </div>
  );
};
