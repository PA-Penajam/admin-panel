const BACKEND_API_URL = process.env.API_URL || 'http://localhost:8000/api';
const BACKEND_API_KEY = process.env.API_KEY || '';

type ProxyContext = {
  params: Promise<{
    path: string[];
  }>;
};

const buildBackendUrl = async (request: Request, context: ProxyContext) => {
  const { path } = await context.params;
  const requestUrl = new URL(request.url);
  const baseUrl = BACKEND_API_URL.replace(/\/+$/, '') + '/';
  const backendUrl = new URL(path.join('/'), baseUrl);
  backendUrl.search = requestUrl.search;
  return backendUrl;
};

const buildHeaders = (request: Request) => {
  const headers = new Headers(request.headers);

  // Header browser yang tidak relevan untuk request ke backend dihapus.
  headers.delete('host');
  headers.delete('content-length');
  headers.delete('x-api-key');

  if (BACKEND_API_KEY) {
    headers.set('X-API-Key', BACKEND_API_KEY);
  }

  return headers;
};

const proxyRequest = async (request: Request, context: ProxyContext) => {
  try {
    const method = request.method.toUpperCase();
    const backendUrl = await buildBackendUrl(request, context);
    const body = method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer();

    return fetch(backendUrl, {
      method,
      headers: buildHeaders(request),
      body,
      cache: 'no-store',
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: 'Gagal meneruskan request ke API backend',
      },
      { status: 502 }
    );
  }
};

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
