
const CASTOR_DOCS_URL = "https://app.castor-docs.com/api/emisores/1792793750001/facturas?filtrar[ambiente]=1&filtrar[busqueda]=&page=1";
const API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiY2ZiYmE5NjJiZjg1MjgxNDM4YWM3YzZkMzllYmQzYzYyZjdhM2YwYWM5NmE5YTRmODE1ZjVjNDU1ZjEzMTUyNTk5ODgxNTgzZTkxMzRlOTciLCJpYXQiOjE3MTM4ODc4OTUuMzc0Mzk3LCJuYmYiOjE3MTM4ODc4OTUuMzc0Mzk4LCJleHAiOjE4NzE2NTQyOTUuMzcyNDczLCJzdWIiOiI2Iiwic2NvcGVzIjpbXX0.XNsQf2rPOEb5wP5u_giIB_1e56YVlOwhvZhf-7mK2Rr_P3IReLLu3VM5zLVR-okoqwg05kGw8uhqKkxMfbnm1PIOeWtA1m-ufxd3DQ1Ik_amKlO3gcYn11XvDbmITV7xDFeEy-3re_LWE0OF9cLeAOG90EjXQmTQ4TubOYYTI5RT65of4p3ZW9ltl2cEkcqaUBu197W06nax2Te-AevU70NNEyacGwKlTHsFfNLr7X2rsTsyfxkQ948eyd1gnkgbEsXpNiRezaC24L3zDIgh6YjreVeaMXqCnJvRgE16THDsfrnb5oKF0SwuUwNdF09Rz2r51ZW3cOJAGto4GAgRdOiPSHVXuXa1UpRd9s4wMomHNudYClJvReL6YZqYEU_oj95YQj5YPeEGn7w-cja1CfrUhhFyDGkZ1cn0tUhSt5c-u06ic4WQzY0BMR8f9XKDJhqhI5Wh8bKRhboCPWnffEMnqSCU91fMXAXh9GKQl84xGhkja4E6e-d4oYIFPj8E8iLpWgsi1srE51jhsg28jB_9Yxjvk3L0I0ti9ho4Uh6vnQnyToJuBd-3frx1xP2qTTu5tHVfCDNXkqh2E6js59d4TuA0CNODH8QL6pF3_66rvrS4IoVN0zS0YFw76x_tIBu-u9Ja1oCE8-aacST8GD4nYqfcEjVs5AuGs3X5Z5w";

const url = `${CASTOR_DOCS_URL}`; 

async function fetchData() {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Error fetching data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchData().then(data =>  data.data.forEach((element) => {console.log(element.id)}));
