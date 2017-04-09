import Axios from 'axios';

const cep = {
  buscar(cep) {
    return Axios.get(`https://viacep.com.br/ws/${cep}/json`);
  }
}

export default cep;