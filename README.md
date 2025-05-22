# API de Processamento de Imagens

## Descrição da Solução e Arquitetura

Esta API foi desenvolvida para processar e otimizar imagens de forma assíncrona, gerando diferentes versões com qualidades variadas. A arquitetura do sistema é baseada em microserviços e utiliza um sistema de filas para processamento assíncrono. Arquitetura em camadas que estende o MVC com Service Layer e Repository Pattern.

## Requisitos para executar o projeto
Para rodar este projeto localmente, é necessário ter o Docker e o Docker Compose instalados em sua máquina.

Certifique-se de que ambos estejam instalados e funcionando corretamente antes de continuar.

### Requisitos de versão

- Docker: >= 20.10.0
- Docker Compose: >= 2.0.0

Você pode conferir suas versões executando:
`docker --version` e
`docker-compose version`

## Instruções para execução do projeto

Certifique-se de que a porta 3000 está disponível e, preferencialmente através do terminal, siga as instruções abaixo:

- Escolha a pasta onde deseja baixar o projeto e clone o repositório utilizando o comando `git clone git@github.com:renatoguedes-dev/teste_tecnico_trakto.git`

- Acesse a pasta do projeto baixado com o comando `cd teste_tecnico_trakto`

- Execute o comando do docker para iniciar o projeto `docker-compose up --build`

- Para interromper a aplicação e remover os containers, pressione `Ctrl+C` no terminal ou execute `docker-compose down`

- Arquivo .env ja está disponível com as configurações necessárias, assim como os 'environments' no arquivo docker-compose.yml.

### Componentes Principais:

1. **API REST (Express/Node.js)**: Recebe as requisições de upload de imagens e consulta de status.
2. **Sistema de Filas (RabbitMQ)**: Gerencia as tarefas de processamento de imagens de forma assíncrona.
3. **Worker de Processamento**: Consome as mensagens da fila e processa as imagens usando a biblioteca Sharp.
4. **Banco de Dados (MongoDB)**: Armazena metadados das imagens e status das tarefas.
5. **Processador de Imagens (Sharp)**: Biblioteca utilizada para manipulação e otimização das imagens.

### Fluxo de Processamento:

1. Cliente faz upload de uma imagem via API REST.
2. API salva a imagem original e cria uma tarefa no banco de dados com status "PENDING".
3. API envia uma mensagem para a fila do RabbitMQ com os dados da imagem.
4. Worker consome a mensagem da fila e inicia o processamento da imagem.
5. Worker gera três versões da imagem com diferentes qualidades:
   - Baixa qualidade (320px de largura, 60% de qualidade)
   - Média qualidade (800px de largura, 80% de qualidade)
   - Alta qualidade otimizada (tamanho original, 90% de qualidade)
6. Worker atualiza o status da tarefa no banco de dados para "COMPLETED" e salva os metadados das versões processadas.
7. Cliente pode consultar o status da tarefa e obter os metadados das imagens processadas.

## Exemplos de Uso da API

### Upload de Imagem

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: multipart/form-data" \
  -F "image=@/caminho/para/sua/imagem.jpg"
```

Resposta:

```json
{
  "task_id": "a1b2c3d4e5f6",
  "status": "PENDING"
}
```

### Consulta de Status da Tarefa

```bash
curl -X GET http://localhost:3000/api/status/a1b2c3d4e5f6
```

Resposta (tarefa em processamento):

```json
{
  "task_id": "a1b2c3d4e5f6",
  "status": "PROCESSING",
}
```

Resposta (tarefa concluída):

```json
{
  "task_id": "a1b2c3d4e5f6",
  "status": "COMPLETED",
}
```

### Verificação de Saúde da API

```bash
curl -X GET http://localhost:3000/health
```

Resposta:

```json
{
  "status": "ok"
}
```

## Decisões de Design

### Arquitetura em camadas que estende o MVC com Service Layer e Repository Pattern

**Benefícios**:

- Separação de responsabilidades.
- Manutenção e legibilidade.
- Reutilização e composição.
- Escalabilidade.
- Aderência a princípios SOLID.

**Trade-offs**:

- Complexidade adicional na arquitetura.

### Arquivo .env e dados de variáveis expostos

**Benefícios**:

- Facilidade de replicação/execução do projeto para testes.

**Trade-offs**:

- Segurança comprometida. Antes de colocar para produção, é necessário proteger as informações expostas.