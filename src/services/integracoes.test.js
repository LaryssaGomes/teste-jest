import { buscaTransacoes, salvaTransacao } from './transacoes';
import { buscaSaldo, atualizaSaldo } from './saldo';
import api from './api';

jest.mock("./api");
// Dados de retorno api
const mockTransacao = [{
    id: 1,
    transacao: 'Depósito',
    valor: '100',
    data: '22/11/2022',
    mes: 'Novembro'
}];

const mockSaldo = {
    valor: '100',
};

const mockNovaTransacao = {
    transacao: "Depósito",
    valor: "400",
    data: "23/05/2023",
    mes: "Maio",
}


const mockSaldoUpdate = '1001';

// Simula o que a api faz
const mockRequisicao = (retorno) =>{
    return new Promise((resolve)=> {
        setTimeout(()=>{
            resolve({
                data: retorno
            })
        }, 200)
    })
}

const mockRequisicaoErro = () =>{
    return new Promise((_,reject)=> {
        setTimeout(()=>{
            reject()
        }, 200)
    })
}

// Rotas Post

const mockRequisicaoPost = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 201,
        });
      }, 200);
    });
};

// Put
const mockRequisicaoPut = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
        });
      }, 200);
    });
};

describe("Requisições para API", ()=> {
    test("Deve retornar uma lista de transações", async ()=>{
       api.get.mockImplementation(()=> mockRequisicao(mockTransacao))
       const transacoes = await buscaTransacoes();
        
       expect(transacoes).toEqual(mockTransacao);
       expect(api.get).toHaveBeenCalledWith("/transacoes")
    });

    test("Deve retornar uma lista vazia quando a requisição falha", async ()=>{
        api.get.mockImplementation(()=> mockRequisicaoErro())
        const transacoes = await buscaTransacoes();
         
        expect(transacoes).toEqual([]);
        expect(api.get).toHaveBeenCalledWith("/transacoes")
    });

    test("Deve retornar uma valor saldo", async ()=>{
        api.get.mockImplementation(()=> mockRequisicao(mockSaldo))
        const valor = await buscaSaldo();
         
        expect(valor).toEqual("100");
        expect(api.get).toHaveBeenCalledWith("/saldo")
    });

    test("Deve retornar uma valor saldo", async ()=>{
        api.get.mockImplementation(()=> mockRequisicaoErro(mockSaldo))
        const valor = await buscaSaldo();
         
        expect(valor).toEqual(1000);
        expect(api.get).toHaveBeenCalledWith("/saldo")
    });

    test("Deve salva o dado", async ()=>{
        api.post.mockImplementation(()=> mockRequisicaoPost(mockNovaTransacao))
        const valor = await salvaTransacao(mockNovaTransacao);
         
        expect(valor).toEqual(201);
        expect(api.post).toHaveBeenCalledWith("/transacoes", mockNovaTransacao)
    });

    test("Deve da error ao testa salvar os dados", async ()=>{
        api.post.mockImplementation(()=> mockRequisicaoErro(mockNovaTransacao))
        const error = await salvaTransacao(mockNovaTransacao);
         
        expect(error).toEqual('Erro na requisição');
        expect(api.post).toHaveBeenCalledWith("/transacoes", mockNovaTransacao)
    });

    test("Deve atualizar o saldo", async ()=>{
        api.put.mockImplementation(()=> mockRequisicaoPut(mockSaldoUpdate));
        const status = await atualizaSaldo(mockSaldoUpdate);

        expect(status).toEqual(200);
        expect(api.put).toHaveBeenCalledWith("/saldo", {valor: mockSaldoUpdate});
    });

    test("Deve da error ao tenta salvar o saldo", async ()=>{
        api.put.mockImplementation(()=> mockRequisicaoErro(mockSaldoUpdate));
        const error = await atualizaSaldo(mockSaldoUpdate);

        expect(error).toEqual('Erro na requisição');
        expect(api.put).toHaveBeenCalledWith("/saldo", {valor: mockSaldoUpdate});
    });
})


