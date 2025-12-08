import React from "react";
import type { Company } from "../types";
import { TwoTabsPage } from "./TwoTabPage";

type Props = {
  startups: Company[];
  investors: Company[];
  onContact: (id: string) => void;
  onBack: () => void;
};

export const StartupInvestorPage: React.FC<Props> = ({ startups, investors, onContact, onBack }) => {
  return (
    <TwoTabsPage
      title="Стартапы и Инвесторы"
      tab1Label="Стартапы"
      tab2Label="Инвесторы"
      tab1Data={startups}
      tab2Data={investors}
      onContact={onContact}
      onBack={onBack}
    />
  );
};
