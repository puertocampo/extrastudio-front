import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export default class Api {
  static fetchSample() {
    return fetch('https://facebook.github.io/react-native/movies.json')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.movies);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  static fetchEvents(limit: number, userId: string) {
    return fetch(`https://us-central1-extrastudio-dev.cloudfunctions.net/api/events?limit=${limit}&userId=${userId}`)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  fetch(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return axios({
      method: config.method || "get",
      baseURL: apiBaseUrl,
      url: config.url,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${localStorage.idToken}`
      },
      ...config,
      params: config.params
    }).catch(err => {
      throw err.response;
    });
  }

}