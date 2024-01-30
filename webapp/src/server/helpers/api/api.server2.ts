export interface RequestOptions {
  method?: string;
  hostname: string;
  port: number;
  protocol: string;
  path: string;
  headers?: Record<string, string>;
  data?: any;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class HttpService {
  private buildUrl(path: string, options: RequestOptions): string {
    return `${options.protocol}://${options.hostname}:${options.port}${path}`;
  }

  private buildConfig(options: RequestOptions): RequestInit {
    const { method, headers, data } = options;

    return {
      method,
      headers: headers || {},
      body: data ? JSON.stringify(data) : undefined,
    };
  }

  private logRequest(options: RequestOptions): void {
    console.log(
      `Making ${options.method} request to ${this.buildUrl(options.path, options)}`,
    );
    console.log("Headers:", options.headers);
    console.log("Data:", options.data);
  }

  public async get(options: RequestOptions): Promise<ApiResponse> {
    options.method = "GET";
    return this.request(options);
  }

  public async post(options: RequestOptions): Promise<ApiResponse> {
    options.method = "POST";
    return this.request(options);
  }

  public async put(options: RequestOptions): Promise<ApiResponse> {
    options.method = "PUT";
    return this.request(options);
  }

  public async delete(options: RequestOptions): Promise<ApiResponse> {
    options.method = "DELETE";
    return this.request(options);
  }

  public async request(options: RequestOptions): Promise<ApiResponse> {
    this.logRequest(options); // Log antes de realizar la solicitud

    const url = this.buildUrl(options.path, options);
    const config = this.buildConfig(options);

    try {
      const response = await fetch(url, { ...config, redirect: "follow" });

      if (response.ok) {
        const responseData = await response.json();
        return { success: true, data: responseData };
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
