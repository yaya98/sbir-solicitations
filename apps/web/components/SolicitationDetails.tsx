import { Solicitation } from "models/Solicitation";

interface SolicitationDetailsProps {
  solicitation: Solicitation;
}

export default function SolicitationDetails({
  solicitation,
}: SolicitationDetailsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {solicitation.solicitationTitle}
        </h2>
        <p className="text-sm text-gray-500">
          Solicitation Number: {solicitation.solicitationNumber}
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Agency</h3>
            <p className="text-gray-600">
              {solicitation.agency ? solicitation.agency : "N/A"}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Branch</h3>
            <p className="text-gray-600">
              {solicitation.branch ? solicitation.branch : "N/A"}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Program
            </h3>
            <p className="text-gray-600">
              {solicitation.program ? solicitation.program : "N/A"}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Phase</h3>
            <p className="text-gray-600">
              {solicitation.phase ? solicitation.phase : "N/A"}
            </p>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-1">
                Release Date
              </p>
              <p className="text-gray-600">
                {solicitation.releaseDate
                  ? new Date(solicitation.releaseDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-1">
                Open Date
              </p>
              <p className="text-gray-600">
                {solicitation.openDate
                  ? new Date(solicitation.openDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-1">
                Close Date
              </p>
              <p className="text-gray-600">
                {solicitation.closeDate
                  ? new Date(solicitation.closeDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-1">
                Application Due
              </p>
              <p className="text-gray-600">
                {solicitation.applicationDueDate.length
                  ? solicitation.applicationDueDate
                      .map((date) => new Date(date).toLocaleDateString())
                      .join(", ")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Topics</h3>
          <div className="space-y-3">
            {solicitation.solicitationTopics.length
              ? solicitation.solicitationTopics.map((topic, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <a
                      href={topic.sbir_topic_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      {topic.topic_title}
                    </a>
                  </div>
                ))
              : "N/A"}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Status</h3>
          <p className="text-gray-600">
            {solicitation.currentStatus.toUpperCase()}
          </p>
        </div>

        <div>
          <a
            href={solicitation.solicitationAgencyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            View on Agency Website
          </a>
        </div>
      </div>
    </div>
  );
}
