import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export default class Api {
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

  static fetchEvents(idToken: string) {
    // const limit = 20;
    return fetch(`https://us-central1-extrastudio-dev.cloudfunctions.net/api/v1/events`, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${idToken}`
      }
    })
      // .then((response) => response.json())
      .then(responseJson => {
        console.log('json', responseJson);
        return { events: responseJson };
      })
      .catch(err => {
        console.error('err', err);
        return { err };
      });
  }

  // static async fetchEvents(idToken: string) {
  //   const limit = 20;
  //   console.log('api idToken', idToken);
  //   return this.fetch({ url: `/events?limit=${limit}`, params: { idToken } })
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       console.log(responseJson);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }

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