import { Solicitation } from "models/Solicitation";
import { useState } from "react";
import Modal from "./Modal";
import SolicitationDetails from "./SolicitationDetails";

export default function SolicitationCard({
  solicitation,
}: {
  solicitation: Solicitation;
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div
        onClick={openModal}
        className="rounded border border-gray-300 p-4 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200"
      >
        <div className="space-y-2">
          <p className="font-semibold text-lg text-gray-800">
            {solicitation.solicitationTitle}
          </p>
          <p className="text-sm text-gray-600">
            Solicitation Number: {solicitation.solicitationNumber}
          </p>
          <p className="text-sm text-gray-500">
            Agency: {solicitation.agency} • Program: {solicitation.program}
          </p>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          component={<SolicitationDetails solicitation={solicitation} />}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
