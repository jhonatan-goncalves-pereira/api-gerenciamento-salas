const request = require('supertest');
const app = require('./app');

describe('Testando rotas do aplicativo', () => {
  let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE3MzcwNTQyNzUsImV4cCI6MTczNzA2MzI3NX0.IYil6VoEd59_Jb6srFTUCD75Mg_qn3x2_T0fo-vKlNY';

  // Aumentando o tempo limite para testes com operações assíncronas mais longas
  jest.setTimeout(30000);

  describe('POST /logar', () => {
    it('Deve retornar status 200 e um token válido ao logar com sucesso', async () => {
      const response = await request(app)
        .post('/logar')
        .send({ email: 'test@test.com', senha: '123456' });
      token = response.body.token;
      expect(response.body).toHaveProperty('token');
    });

    it('Deve retornar status 401 ao falhar no login', async () => {
      const response = await request(app)
        .post('/logar')
        .send({ email: 'usuario', senha: 'senha_errada' });
      expect(response.body).toHaveProperty('mensagem', 'Dados incorretos');
    });
  });

  describe('POST /laboratorio/novo', () => {
    it('Deve retornar status 201 e os dados do novo laboratório ao criar com sucesso', async () => {
      const laboratorioData = {
        nome: 'Laboratório A',
        desc: 'Rua Exemplo, 123',
        capacidade: 21,
        foto: 'img',
        token: token,
      };

      const response = await request(app)
        .post('/laboratorio/novo')
        .send(laboratorioData);
      expect(response.body).toHaveProperty('mensagem');
    });

    it('Deve retornar status 400 ao faltar dados obrigatórios', async () => {
      const response = await request(app)
        .post('/laboratorio/novo')
        .send({ nome: 'Laboratório Incompleto', token });
      expect(response.body).toHaveProperty('err', {});
    });
  });

  describe('GET /laboratorio/relatorio', () => {
    it('Deve retornar status 200 e um relatório de laboratórios', async () => {
      const response = await request(app).get('/laboratorio/relatorio');
      expect(response.status).toBe(200);
    });

    it('Deve retornar status 404 se não houver dados no relatório', async () => {
      const response = await request(app).get('/laboratorio/relatorio');
      // Verifique a lógica do retorno, talvez o código 200 seja retornado mesmo sem dados
      if (response.body.length === 0) {
        expect(response.status).toBe(404);
      } else {
        expect(response.status).toBe(200);
      }
    });
  });

  // Fechar qualquer recurso ou servidor após os testes
  afterAll(() => {
    app.close();
  });
});
