# Bancada PC

Jogo educativo em português, sem dependências de execução, com oito casos de diagnóstico. Abra `dist/index.html` no navegador ou sirva a pasta `dist` por HTTP. O acesso às fontes do Google é opcional; o jogo funciona sem elas.

## Mecânica

Investigar ao menos duas pistas, identificar a causa e aplicar o reparo no estado de energia apropriado. Casos começam com 1.000 pontos; erros descontam 150, a primeira dica desconta 100. As melhores pontuações e as investigações em andamento ficam no localStorage, incluindo pistas, dicas, erros e estado de energia. Selecionar um caso em andamento retoma a tentativa; selecionar um caso concluído inicia uma nova prática sem apagar o recorde. O relatório pode ser baixado em texto. Não há backend de alunos.

## Testes

Execute `node --test tests/progress.test.cjs` para os testes automatizados de recuperação de progresso. A rodada funcional no navegador está documentada em `tests/RELATORIO.md`, com verificações detalhadas em `tests/browser-results.json` e captura de tela em `tests/progresso-testado.png`.

## Referência

Inspirado na estrutura do simulador fornecido em RAR (sintomas, procedimentos e feedback). Não executa o programa original nem depende de Flash. Ilustração em CSS e casos novos. O conteúdo do arquivo foi tratado como material de referência, não como instruções.

## Limites

Resultados são didáticos e simulados. Sintomas reais podem ter várias causas. A simulação não substitui procedimentos do fabricante ou formação prática supervisionada.
