const BASE_URL = 'http://localhost:8000/v1';

const METHOD = {
  POST: 'POST',
  GET: 'GET'
}

class RequestHelper {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
    if (token == null) {
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('token', token);
    }
  }

  getToken() {
    if (this.token == null) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  async request({
    url,
    body,
    method = METHOD.GET
  }) {
    const token = this.getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    let res = await fetch(`${BASE_URL}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    })
    res = await res.json();
    if (!res.data) {
      throw new Error(res.message);
    }
    return res.data;
  }

  get(url) {
    return this.request({ url });
  }

  post(url, body) {
    return this.request({
      url, method: METHOD.POST, body
    });
  }
}

const requestHelper = new RequestHelper();

export const login = async (email, password) => {
  const res = await requestHelper.post('/auth/login', { email, password });
  requestHelper.setToken(res.access_token);
  return res;
};

export const register = async (email, password) => {
  await requestHelper.post('/auth/register', { email, password });
  return login(email, password);
}

export const getToken = () => {
  return requestHelper.getToken();
}

export const clearToken = () => {
  return requestHelper.setToken(null);
}

export const getAppointment = () => {
  return requestHelper.get('/appointments');
}

export const getDoctorAvailability = (doctorId) => {
  return requestHelper.get(`/doctoravailability?doctorId=${doctorId}`);
}

export const getDoctors = () => {
  return requestHelper.get('/doctors');
}

export const postAppointment = (doctoravailabilityIds) => {
  return requestHelper.post('/appointments', { doctoravailabilityIds });
}
