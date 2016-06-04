# Algoritmo de Fluxo Máximo

Trabalho Prático de Algoritmos de Otimização - UNISC 2016/1

### Requisitos

Para rodar o programa, é preciso ter o [node.js](https://nodejs.org/en/) versão 4 ou superior instalado no computador.

### Como executar

1. Instalar as dependências executando `npm install` na pasta do projeto (necessário apenas antes de executar o app pela primeira vez)

2. Executar `node app.js /caminho/para/entrada.txt` -- o arquivo com o grafo de entrada deve ser especificado como argumento

O projeto possui dois arquivos de exemplo: `samples/1.txt` e `samples/2.txt` com exercícios vistos em aula.

### Formato do arquivo de entrada

O arquivo de entrada deve ser de texto simples, cada linha deve informar a ligação entre dois nós do grafo e o valor da ligação. Por exemplo:

`1 3 14`

Significa que o nó 1 está ligado ao nó 3 com o valor 14 (na direção 1 → 3). Na direção oposta (3 → 1), o valor assumido será 0, a menos que exista outra linha no arquivo especificando o valor desejado (por exemplo, `3 1 5`).

O nó de menor valor será escolhido como origem do fluxo, e o de maior valor será escolhido como destino do fluxo.

### Formato da saída

O programa irá imprimir a saída no mesmo formato da entrada, indicando as relações entre todos os nós com seus valores, e a soma ao final.

### Opções adicionais

Algumas opções adicionais podem ser especificadas como argumentos para o programa.

- `--start` ou `-s`: para especificar nó de origem do fluxo manualmente
- `--end` ou `-e`: para especificar nó de destino do fluxo manualmente
- `--output` ou `-o`: caminho do arquivo para gravar o resultado

Exemplo: `node app.js /caminho/para/entrada.txt --output /caminho/para/saida.txt --start 1 --end 5`
