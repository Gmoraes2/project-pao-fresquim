import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/";
const timeout = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || 25000);
const loadingDelay = Number(process.env.NEXT_PUBLIC_API_LOADING_DELAY_MS || 800);

export const API_LOADING_EVENT = "pao-fresquim:api-loading";

let pendingRequests = 0;
let loadingTimer = null;
let showDelayedLoader = false;

const api = axios.create({
  baseURL,
  timeout,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

function emitLoadingState() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(API_LOADING_EVENT, {
      detail: {
        isLoading: pendingRequests > 0,
        showLoader: showDelayedLoader,
        pendingRequests,
      },
    }),
  );
}

function startRequest() {
  pendingRequests += 1;

  if (pendingRequests === 1) {
    showDelayedLoader = false;
    loadingTimer = window.setTimeout(() => {
      if (pendingRequests > 0) {
        showDelayedLoader = true;
        emitLoadingState();
      }
    }, loadingDelay);
  }

  emitLoadingState();
}

function finishRequest() {
  pendingRequests = Math.max(0, pendingRequests - 1);

  if (pendingRequests === 0) {
    if (loadingTimer) {
      window.clearTimeout(loadingTimer);
      loadingTimer = null;
    }

    showDelayedLoader = false;
  }

  emitLoadingState();
}

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      startRequest();
    }

    return config;
  },
  (error) => {
    if (typeof window !== "undefined") {
      finishRequest();
    }

    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    if (typeof window !== "undefined") {
      finishRequest();
    }

    return response;
  },
  (error) => {
    if (typeof window !== "undefined") {
      finishRequest();
    }

    if (error.code === "ECONNABORTED") {
      error.userMessage =
        "O servidor demorou para responder. Tente novamente em alguns segundos.";
    } else if (!error.response) {
      error.userMessage =
        "Nao foi possivel conectar ao servidor. Confira se o back-end esta rodando.";
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(
  error,
  fallback = "Ocorreu um erro ao conectar com o servidor.",
) {
  return (
    error?.userMessage ||
    error?.response?.data?.mensagem ||
    error?.response?.data?.message ||
    error?.response?.data?.erro ||
    fallback
  );
}

export default api;
