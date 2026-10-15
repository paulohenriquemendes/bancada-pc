# Bancada PC

Jogo educativo de diagnóstico de computadores, em português, com 20 desafios de hardware e software. Acesso livre, sem cadastro.

**Jogar:** https://paulohenriquemendes.github.io/bancada-pc/

## Funcionalidades

- Investigação de sintomas, coleta de pistas, diagnóstico e reparo.
- Computador animado e controles de energia.
- Pontuação, dicas, busca e filtros de desafios.
- Interface adaptada para celular e computador.
- Progresso salvo no navegador e exportação de relatório.
- Preferência para pausar animações e suporte a movimento reduzido.

## Rodar localmente

Na raiz do repositório:

```sh
python -m http.server 4174 --bind 127.0.0.1 --directory dist
```

Abra http://127.0.0.1:4174/.

## Testes

Com Node.js instalado:

```sh
node --test tests/progress.test.cjs
```

## Publicação

O workflow `.github/workflows/pages.yml` executa os testes e publica `dist` no GitHub Pages a cada push na branch `main`. Não há etapa de build nem dependências de execução. Fontes externas são opcionais; há fontes alternativas locais.

O progresso fica no localStorage de cada navegador e endereço. O progresso local não é transferido automaticamente para o endereço publicado. Não há backend nem cadastro de alunos.

Os cenários são simulações educativas; os mesmos sintomas podem ter causas diferentes em equipamentos reais.

