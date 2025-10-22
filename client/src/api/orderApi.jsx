import axiosInstance from './axios';

class OrderApi {
  constructor() {
    this.basePath = 'api/v1/order';
  }

  // request(method, url, data) {
  //   return new Promise((resolve, reject) => {
  //     axiosInstance[method](`${this.basePath}${url}`, data)
  //       .then((response) => {
  //         resolve(response.data);
  //       })
  //       .catch((error) => {
  //         reject(error.response.data);
  //       });
  //   });
  // }
  request(method, url, data) {
  return new Promise((resolve, reject) => {
    let axiosCall;

    if (method === 'get' || method === 'delete') {
      axiosCall = axiosInstance[method](`${this.basePath}${url}`, { params: data });
    } else {
      axiosCall = axiosInstance[method](`${this.basePath}${url}`, data);
    }

    axiosCall
      .then((response) => resolve(response.data))
      .catch((error) => {
        reject(error.response?.data || { message: error.message });
      });
  });
}


  CreateOrder(data) {
     return this.request('post', '/', data);
  }
 
  GetOneOrder(id) {
    return this.request('get', `/${id}`);
  }
  PayOrder(id , data ) {
    return this.request('patch', `/${id}/pay`, data);
  }
  GetMyOrders() {
    return this.request('get', `/mine`);
  }
  GetAllOrders(){
    return this.request('get', `/all`);
  }
  DeleteOrder(id){
    return this.request('delete', `/${id}`);
  }
   
  DeliverOrder(id) {
    return this.request('patch', `/${id}/deliver`);
  }
}

export const orderApi = new OrderApi();
