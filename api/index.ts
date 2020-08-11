import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IUser } from "../type/user";
import { IEvent } from "../type/event";

const Axios = axios.create({
  // DEV環境
  // baseURL: 'https://extrastudio-dev.appspot.com/v1/',
  // モックデータ
  baseURL: 'https://us-central1-extrastudio-tmp.cloudfunctions.net/api/',
  headers: {
    "Content-Type": "application/json; charset=UTF-8"
  }
});

export default class Api {
  static async postUser(req: { user: IUser, idToken: string }) {
    Axios.defaults.headers.common['Authorization'] = `Bearer ${req.idToken}`;
    return Axios.post(`/users`, req.user)
      .then(({ data }) => {
        return { user: data };
      })
      .catch(err => {
        return { err };
      });
  }

  static async fetchUser(req: { userId: string, idToken: string }) {
    Axios.defaults.headers.common['Authorization'] = `Bearer ${req.idToken}`;
    return Axios.post(`/users/${req.userId}/login`, {
      idToken: req.idToken
    })
      .then(({ data }) => {
        return { user: data };
      })
      .catch(err => {
        return { err };
      });
  }

  static async evaluateEvent(req: { userId: string, event: IEvent, evaluate: string, idToken: string }) {
    Axios.defaults.headers.common['Authorization'] = `Bearer ${req.idToken}`;
    return Axios.put(`/users/${req.userId}/events/${req.event.eventId}`, {
      evaluate: req.evaluate
    })
      .then(({ data }) => {
        return { event: data };
      })
      .catch(err => {
        return { err };
      });
  }

  static async fetchEvents(req: { userId: string, idToken: string }) {
    const limit = 20;
    Axios.defaults.headers.common['Authorization'] = `Bearer ${req.idToken}`;
    return Axios.get(`/events?limit=${limit}&userId=${req.userId}`)
      .then(({ data }) => {
        return { events: data };
      })
      .catch(err => {
        return { err };
      });
  }

  static fetch(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return axios({
      method: config.method || "get",
      baseURL: "https://us-central1-extrastudio-dev.cloudfunctions.net/api/v1",
      url: config.url,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${config.params.idToken}`
      },
      ...config,
      params: config.params
    }).catch(err => {
      throw err.response;
    });
  }

}