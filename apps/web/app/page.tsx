"use client";

import { useEffect, useState } from "react";
import SolicitationCard from "components/SolicitationCard";
import { Solicitation } from "models/Solicitation";

export default function Home() {
  const [solicitations, setSolicitations] = useState<Solicitation[]>([]);
  const [keyword, setKeyword] = useState("");
  const [agency, setAgency] = useState("");

  async function getSolicitations() {
    const SOLICITATION_BACKEND_API: string =
      process.env.NEXT_PUBLIC_API_SERVER_URL || "http://localhost:8080";
    if (!SOLICITATION_BACKEND_API) {
      console.error("API server URL is not configured");
      return;
    }

    try {
      const url = new URL("/solicitations", SOLICITATION_BACKEND_API);

      if (keyword) {
        url.searchParams.append("keyword", keyword);
      }
      if (agency) {
        url.searchParams.append("agency", agency);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Error fetching with status: ${response.status}`);
      }
      const result = await response.json();
      setSolicitations(result);
    } catch (error) {
      console.error("Error fetching solicitations:", error);
      setSolicitations([]);
    }
  }

  useEffect(() => {
    getSolicitations();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto my-4 space-y-6">
        <h1 className="text-2xl font-bold mb-6">SBIR Search</h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by solicitation title or number"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={getSolicitations}
          >
            Search
          </button>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-gray-700">
            Search by agency
            <input
              type="text"
              placeholder="Agency name..."
              className="px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              onChange={(e) => setAgency(e.target.value)}
            />
          </label>
        </div>
      </div>

      <hr className="max-w-2xl mx-auto border-t border-gray-200 my-8" />

      <div className="flex flex-col gap-4">
        {solicitations.map((solicitation) => (
          <SolicitationCard key={solicitation.id} solicitation={solicitation} />
        ))}
      </div>
    </div>
  );
}
