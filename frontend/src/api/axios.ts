import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de requisição para adicionar token do localStorage
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Timeout amigável para avisar usuário se servidor estiver acordando
let timeoutId: ReturnType<typeof setTimeout> | null = null;

function showServerWakingUpToast() {
  const el = document.createElement("div");
  el.innerText = "⏳ O servidor está acordando, isso pode levar alguns segundos...";
  el.className = `
    fixed bottom-5 right-5 
    bg-blue-600 text-white text-sm font-medium 
    px-4 py-2 rounded-lg shadow-lg 
    animate-fade-in
    z-[9999]
  `;
  document.body.appendChild(el);

  setTimeout(() => {
    el.classList.add("opacity-0", "transition", "duration-500");
    setTimeout(() => el.remove(), 500);
  }, 5000);
}

api.interceptors.request.use(config => {
  if (timeoutId) clearTimeout(timeoutId);

  // Se demorar mais de 3 segundos mostra o aviso
  timeoutId = setTimeout(() => {
    showServerWakingUpToast();
  }, 30);

  return config;
});


// Interceptor de resposta para tratamento global de erros
api.interceptors.response.use(
    response => {
        if (timeoutId) clearTimeout(timeoutId);
        return response;
    },
    error => {
        if (timeoutId) clearTimeout(timeoutId);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
