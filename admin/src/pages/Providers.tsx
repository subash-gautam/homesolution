import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CheckCircle, XCircle, FileText, ExternalLink } from "lucide-react";
import { useAppDispatch } from "../store";
import type { RootState } from "../store";
import type { Provider } from "../types";
import {
  fetchProviders,
  updateProviderStatus,
  updateVerificationDocumentAsync,
  //   fetchDocumentUrl
  fetchProviderServices,
} from "../store/slices/providerSlice";

const Providers = () => {
  const dispatch = useAppDispatch();
  const { providers, isLoading } = useSelector((state: RootState) => state.providers);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  // const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    dispatch(fetchProviders());
  }, [dispatch]);

  // Fetch services for all providers (or selectively)
  useEffect(() => {
    providers.forEach((provider) => {
      if (!provider.services) {
        console.log("Fetching services for provider:", provider.services);
        dispatch(fetchProviderServices(provider.id));
        console.log("Services fetched for provider:", provider.services);
      }
    });
  }, [providers, dispatch]);

  // to fetch document URLs when provider is selected
  //   useEffect(() => {
  //     if (selectedProvider && selectedProvider.document) {
  //       console.log('Documents:', selectedProvider.document);

  //         if (!selectedProvider.document.url) { // Only fetch if URL doesn't exist
  //           console.log('Fetching URL for doc:', doc.id);
  //           dispatch(fetchDocumentUrl(selectedProvider.document.id));
  //         }

  //     }
  //   }, [selectedProvider, dispatch]);

  const handleVerification = (
    providerId: number,
    status: "verified" | "rejected"
  ) => {
    dispatch(updateProviderStatus({ providerId, status }));
  };

  const handleDocumentReview = (
    providerId: number,
    documentId: number,
    status: "verified" | "rejected"
  ) => {
    dispatch(
      updateVerificationDocumentAsync({
        providerId,
        documentId,
        updates: {
          status,
          lastReview: new Date(),
          comment: reviewComment,
        },
      })
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Service Providers</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Provider
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Services
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Documents
              </th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {providers.map((provider) => (
              <tr key={provider.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {provider.name}
                  </div>
                  <div className="text-sm text-gray-500">{provider.email}</div>
                  <div className="text-sm text-gray-500">{provider.phone}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {provider.services ? (
                    provider.services.length > 0 ? (
                      provider.services.map((service) => (
                        <span
                          key={service.service.id}
                          className="inline-block px-2 py-1 mr-2 text-xs font-medium text-blue-800 bg-blue-100 rounded-full"
                        >
                          {service.service.name}
                        </span>
                      ))
                    ) : (
                      <span className="inline-block px-2 py-1 mr-2 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                        No services available
                      </span>
                    )
                  ) : (
                    <span className="text-gray-500">Loading...</span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      provider.verificationStatus === "verified"
                        ? "bg-green-100 text-green-800"
                        : provider.verificationStatus === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {provider.verificationStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setSelectedProvider(provider)}
                    className="flex items-center text-blue-600 hover:text-blue-900"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    View Documents
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {provider.verificationStatus === "pending" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleVerification(provider.id, "verified")
                        }
                        className="text-green-600 hover:text-green-900"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          handleVerification(provider.id, "rejected")
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Document Review Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Documents - {selectedProvider.name}
              </h2>
              <button
                onClick={() => setSelectedProvider(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {selectedProvider.document ? (
              <div className="space-y-6">
                <div
                  key={selectedProvider.document.id}
                  className="p-4 space-y-4 border rounded-lg"
                >
                  {/* Render the document details */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">
                        {selectedProvider.document.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Uploaded:{" "}
                        {new Date(
                          selectedProvider.document.uploadedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedProvider.document.status === "verified"
                          ? "bg-green-100 text-green-800"
                          : selectedProvider.document.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedProvider.document.status}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                      //   href={selectedProvider.document.url}
                      href={`http://localhost:3000/uploads/${selectedProvider.document.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View Document
                    </a>
                  </div>

                  {selectedProvider.document.status === "pending" && (
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="comment"
                          className="block mb-1 text-sm font-medium text-gray-700"
                        >
                          Review Comment
                        </label>
                        <textarea
                          id="comment"
                          rows={3}
                          className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Add your review comments here..."
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() =>
                            handleDocumentReview(
                              selectedProvider.id,
                              selectedProvider.document!.id,
                              "verified"
                            )
                          }
                          className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            handleDocumentReview(
                              selectedProvider.id,
                              selectedProvider.document!.id,
                              "rejected"
                            )
                          }
                          className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedProvider.document.status !== "pending" && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        <strong>Reviewed:</strong>{" "}
                        {selectedProvider.document.lastReview &&
                          new Date(
                            selectedProvider.document.lastReview
                          ).toLocaleDateString()}
                      </p>
                      {selectedProvider.document.comment && (
                        <p className="mt-1 text-sm text-gray-600">
                          <strong>Comments:</strong>{" "}
                          {selectedProvider.document.comment}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">No documents uploaded</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Providers;
