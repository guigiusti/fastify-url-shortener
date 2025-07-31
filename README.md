<p align="center">
  <h1 align="center">Encurtador de URL</h1>
</p>
<div align="center" margin-top="25px">

  ![](https://img.shields.io/github/languages/count/guigiusti/fastify-url-shortener)

  ![](https://img.shields.io/github/languages/top/guigiusti/fastify-url-shortener)
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

## Sumário
- [Sobre](#sobre)
- [Requisitos](#requisitos)
- [Como rodar](#como-rodar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints](#endpoints)

## Sobre

Um encurtador simples de URL feito com Fastify, Redis e LowDB

Com sua própria instância de Nginx e Redis configurado para rodar em um ambiente local, pode ser facilmente modificado para ser usado em outros ambientes ou com outras tecnologias.

Caso queira inserir URLs encurtados previamente, sem utilizar os endpoints de admin, pode-se editar o arquivo [db.json](https://github.com/guigiusti/fastify-url-shortener/blob/main/db.json), no formato do exemplo fornecido. Ele será copiado para dentro do Docker e através do LowDB terá suas informações repassadas para o Redis.

Os endpoints de manutenção utilizam de par de chave pública e privada para autenticação via JWT, um exemplo de uso é fornecido em [python](https://github.com/guigiusti/fastify-url-shortener/blob/main/example/admin_request.py) e [typescript](https://github.com/guigiusti/fastify-url-shortener/blob/main/example/admin_request.ts). 

## Requisitos

### Docker

Siga a [documentação](https://docs.docker.com/engine/install/) respectiva à sua máquina para instalar o docker. 

### Clone o repositório
```
git clone https://github.com/guigiusti/fastify-url-shortener.git

cd fastify-url-shortener
```

### Chaves de autenticação

O projeto usa um sistema simples de autenticação via JWT para os endpoints de Admin. Para ser o mais seguro possível, utiliza-se o esquema de [chave pública e privada](https://www.totvs.com/blog/gestao-para-assinatura-de-documentos/chave-publica-e-privada/), onde a chave pública apenas serve para validação, sendo segura de expor. Em contraponto todos requests aos endpoints de Admin, precisam ser "assinados" pela chave privada - que nunca deve ser exposta.

Apenas a chave pública será copiada e utilizada com o Fastify.

Crie suas chaves dentro da raiz do projeto com OpenSSL:
```
openssl genpkey -algorithm ed25519 -out private.pem
openssl pkey -in  private.pem -pubout -out public.pem
```
**Importante**: Caso edite os arquivos de Docker, evite importar tudo, ou adicione um .dockerignore com "private.pem", para evitar a exposição desnecessária da chave privada.

### Variáveis de ambiente

Arquivo .env com os valores esperados do Bearer em JWT:
JWT_AUD = JWT Audience;
JWT_ISS = JWT Issuer;

Outras variáveis também podem ser modificadas como explicado no [exemplo](https://github.com/guigiusti/fastify-url-shortener/blob/main/.env.example).


## Como rodar:

Dentro da raiz do projeto, abra o terminal e digite:

```
docker compose up
```

Para rodar no fundo (detached):

```
docker compose up -d
```

Agora basta acessar http://localhost/exemplo, ou caso tenha adicionado alguma URL, basta substituir "exemplo". O endpoint http://localhost/qrcode/exemplo retornará a imagem QR Code do URL.

## Estrutura do Projeto
```
src/
├── plugins/ 
├── routes/
├── schemas/ 
├── types/
└── utils/
```


## Endpoints

### Navegáveis
```
GET /:shortId
HTTP 302

Redireciona o usuário para o URL cheio, caso exista
```
```
GET /qrcode/:shortId
HTTP 200

Retorna: uma imagem com QR Code para aquele URL cheio, caso exista
```

### Admin

```
GET /admin/urls
HTTP 200

Retorna: Lista de todas URLs encurtadas
Request Header {
  "Authorization": "Bearer ...token"
}
Response Body: {
  "urls": [
    {
      "shortId": "string",
      "url": "string", 
      "user": "string",
      "createdAt": "string"
    }
  ]
}
```
```
POST /admin/urls
HTTP 201

Cria uma nova URL de Redirecionamento
Request Header {
  "Authorization": "Bearer ...token"
}
Request Body {
    "url": string
    "shortId": string (opicional, um ID aleatório será gerado se ausente)
}
Response Body: {
    "shortUrl": "string"
}
```
```
PUT /admin/urls
HTTP 204

Atualiza uma URL já existente
Request Header {
  "Authorization": "Bearer ...token"
}
Request Body {
    "url": string
    "shortId": string
}
```
```
DEL /admin/urls
HTTP 204

Deleta um encurtamento de URL
Request Header {
  "Authorization": "Bearer ...token"
}
Request Body {
    "shortId": string
}
```

### Manutenção
```
GET /health
HTTP 200
```