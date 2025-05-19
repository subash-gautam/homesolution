import apiClient from "../../api/apiClient";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { Provider, Document } from "../../types";
import { toast } from 'react-toastify';

interface ProviderState {
  providers: Provider[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProviderState = {
  providers: [],
  isLoading: false,
  error: null,
};

//fetching services for a specific provider
export const fetchProviderServices = createAsyncThunk(
  "providers/fetchServices",
  async (providerId: number, { rejectWithValue }) => {
    //providerServices/services/3
    try {
      const response = await apiClient.get(
        `/providerServices/services/${providerId}`
      );
      return { providerId, services: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch services"
      );
    }
  }
);

// thunk for fetching document URL
export const fetchDocumentUrl = createAsyncThunk(
  "providers/fetchDocumentUrl",
  async (documentId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/documents/${documentId}`);
      // return { documentId, url: response.data.url };
      return {
        documentId,
        url: `http://localhost:8000/uploads/${response.data.type}.jpg`,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch document URL"
      );
    }
  }
);

export const fetchProviders = createAsyncThunk(
  "providers/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/providers");
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch providers"
      );
    }
  }
);

export const updateProviderStatus = createAsyncThunk(
  "providers/updateStatus",
  async (
    {
      providerId,
      verificationStatus,
    }: { providerId: number; verificationStatus: "verified" | "rejected" },
    { rejectWithValue }
  ) => {
    try {
      await apiClient.put(`/providers/verify`, { providerId, status: verificationStatus });
      return { providerId, verificationStatus };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update status"
      );
    }
  }
);

//upadte status of document
export const updateVerificationDocumentAsync = createAsyncThunk(
  "providers/updateVerificationDocumentAsync",
  async (
    {
      providerId,
      documentId,
      updates,
    }: {
      providerId: number;
      documentId: number;
      updates: Partial<Document>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.put(
        // `/providers/${providerId}/document/${documentId}`,
        `/admin/review `,  
        {...updates,documentId}
      );
      console.log("updateVerificationDocument ko response", response);
      return { providerId, documentId, updates };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update document"
      );
    }
  }
);

const providerSlice = createSlice({
  name: "providers",
  initialState,
  reducers: {
    setProviders: (state, action: PayloadAction<Provider[]>) => {
      state.providers = action.payload;
    },
    addVerificationDocument: (
      state,
      action: PayloadAction<{
        providerId: number;
        document: Document;
      }>
    ) => {
      const provider = state.providers.find(
        (p) => p.id === action.payload.providerId
      );
      if (provider) {
        provider.document = action.payload.document;
      }
    },
    updateVerificationDocument: (
      state,
      action: PayloadAction<{
        providerId: number;
        documentId: number;
        updates: Partial<Document>;
      }>
    ) => {
      const provider = state.providers.find(
        (p) => p.id === action.payload.providerId
      );
      if (
        provider &&
        provider.document &&
        provider.document.id === action.payload.documentId
      ) {
        provider.document = {
          ...provider.document,
          ...action.payload.updates,
        };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.providers = action.payload;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProviderStatus.fulfilled, (state, action) => {
        const { providerId, verificationStatus } = action.payload;
        const provider = state.providers.find((p) => p.id === providerId);
        if (provider) {
          provider.verificationStatus = verificationStatus;
        }
        toast.success("Provider status updated successfully");
      })
      .addCase(updateVerificationDocumentAsync.fulfilled, (state, action) => {
        const { providerId, documentId, updates } = action.payload;
        const provider = state.providers.find(
          (p) => p.id === providerId
        );

        if (
          provider &&
          provider.document &&
          provider.document.id === action.payload.documentId
        ) {
          provider.document = {
            ...provider.document,
            ...action.payload.updates,
          };
        }
        toast.success("Document status updated successfully");
      })
      .addCase(fetchProviderServices.fulfilled, (state, action) => {
        const { providerId, services } = action.payload;

        const provider = state.providers.find((p) => p.id === providerId);
        if (provider) {
          provider.services = services;
        }
      })
      .addCase(fetchDocumentUrl.fulfilled, (state, action) => {
        const { documentId, url } = action.payload;

        return {
          ...state,
          providers: state.providers.map((provider) => {
            if (provider.document?.id === documentId) {
              return {
                ...provider,
                document: {
                  ...provider.document,
                  url,
                },
              };
            }
            return provider;
          }),
        };
      });
    //
  },
});

export const {
  setProviders,
  addVerificationDocument,
  updateVerificationDocument,
  setLoading,
  setError,
} = providerSlice.actions;
export default providerSlice.reducer;
