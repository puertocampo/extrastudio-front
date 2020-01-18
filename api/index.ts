import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IUser } from "../type/user";

const Axios = axios.create({
  baseURL: 'https://us-central1-extrastudio-dev.cloudfunctions.net/api/v1',
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
      data: {
        idToken: req.idToken
      },
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${req.idToken}`
      }
    })
      .then(({ data }) => {
        return { user: data };
      })
      .catch(err => {
        return { err };
      });
  }

  // static fetchSample() {
  //   return fetch('https://facebook.github.io/react-native/movies.json')
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       console.log(responseJson.movies);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

  // static fetchEvents(idToken: string) {
  //   const limit = 20;
  //   return fetch(`https://us-central1-extrastudio-dev.cloudfunctions.net/api/v1/events?limit=${limit}`, {
  //     headers: {
  //       "Content-Type": "application/json; charset=UTF-8",
  //       Authorization: `Bearer ${idToken}`
  //     }
  //   })
  //     .then(response => {
  //       console.log('response', response.json());
  //       console.log(Object.keys(response.json()));
  //       return response.json()
  //     })
  //     .then(events => {
  //       console.log(typeof events);
  //       return { events }
  //     })
  //     .catch(err => {
  //       console.log('err', err);
  //       return { err };
  //     });
  // }

  // static async fetchEvents(idToken: string) {
  //   const limit = 20;
  //   return this.fetch({ url: `https://us-central1-extrastudio-dev.cloudfunctions.net/api/v1/events?limit=${limit}`, params: { idToken } })
  //     .then(({ data }) => {
  //       console.log('data', data);
  //       return { events: data };
  //     })
  //     .catch((error) => {
  //       console.log('err', error);
  //       return { err: error };
  //     });
  // }

  static async fetchEvents(idToken: string) {
    const limit = 20;
    return axios.get(`https://us-central1-extrastudio-dev.cloudfunctions.net/api/v1/events?limit=${limit}`, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${idToken}`
      }
    })
      .then(({ data }) => {
        return { events: data };
      })
      .catch(err => {
        return { err };
      });
  }

  static fetch(config: AxiosRequestConfig): Promise<AxiosResponse> {
    console.log('fetch');
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