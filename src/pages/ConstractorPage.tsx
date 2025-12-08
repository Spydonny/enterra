import React from "react";
import type { Company } from "../types";
import { TwoTabsPage } from "./TwoTabPage";

type Props = {
  services: Company[];
  contractors: Company[];
  onContact: (id: string) => void;
  onBack: () => void;
};

export const ContractorsPage: React.FC<Props> = ({ services, contractors, onContact, onBack }) => {
  return (
    <TwoTabsPage
      title="Исполнители и Подрядчики"
      tab1Label="Исполнители"
      tab2Label="Подрядчики"
      tab1Data={services}
      tab2Data={contractors}
      onContact={onContact}
      onBack={onBack}
    />
  );
};
