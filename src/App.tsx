import React from "react";
import { Sidebar } from "./components/Sidebar";
import { Home } from "./pages/main/Home";
import { Feed } from "./pages/Feed";
import { Messages } from "./pages/Messages";
import { ProfilePage } from "./pages/profile/Profile";
import { MyCompanyProfilePage } from "./pages/profile/MyProfilePage";
import Documents from "./pages/Documents";
import { ContractorsPage } from "./pages/main/ConstractorPage";
import { StartupInvestorPage } from "./pages/main/StartupInvestorPage";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { CreateCompany } from "./pages/auth/CreateCompanies";

import { getMe } from "./data/api/user.api";
import { chatsApi } from "./data/api/chats.api";

export const App: React.FC = () => {
  const [route, setRoute] = React.useState<string>("login");
  const [isAuth, setIsAuth] = React.useState<boolean | null>(null);
  const [hasCompany, setHasCompany] = React.useState(false);


  const [selectedCompany, setSelectedCompany] = React.useState<any>(null);

  function openProfile(company: any) {
    setSelectedCompany(company);
    setRoute("profile");
  }

  async function handleContact(companyOwnerId: string) {
    try {
      // Create or get chat with this company owner
      await chatsApi.createChat(companyOwnerId);

      // Navigate to messages page - Messages component will load the chat list
      setRoute("messages");
    } catch (err) {
      console.error("Failed to create chat:", err);
      // Still navigate to messages page to show existing chats
      setRoute("messages");
    }
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
            onContact={handleContact}
            onNavigate={setRoute}
            onOpenProfile={openProfile}
          />
        )}

        {route === "contractors" && (
          <ContractorsPage
            onContact={handleContact}
            onBack={() => setRoute("home")}
          />
        )}

        {route === "startup-investor" && (
          <StartupInvestorPage
            onContact={handleContact}
            onBack={() => setRoute("home")}
          />
        )}

        {route === "feed" && (
          <Feed
          />
        )}

        {route === "messages" && <Messages />}

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
