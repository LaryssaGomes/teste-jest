import api from './api';

export async function buscaSaldo() {
  try {
    const resp = await api.get('/saldo');
    return resp.data.valor;
  } catch (err) {
    return 1000;
  }
}

export async function atualizaSaldo(novoSaldo) {
 return api
    .put('/saldo', { valor: novoSaldo })
    .then((resp) => resp.status)
    .catch(() => 'Erro na requisição');
}
