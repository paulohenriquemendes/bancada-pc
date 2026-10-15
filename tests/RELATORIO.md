# Testes funcionais — Bancada PC

## Resultado

147 verificações registradas no navegador, incluindo execução inicial e regressão. Duas falhas foram encontradas, corrigidas e retestadas com sucesso. As demais 145 verificações, que incluem esses retestes, passaram. Dez testes automatizados de persistência passaram. Nenhuma falha funcional conhecida permaneceu nos fluxos exercitados.

## Ambiente e isolamento

- Navegador integrado do Codex, em Windows.
- Testes realizados em `http://127.0.0.1:4173`, separado da origem `http://localhost:4173` utilizada pelo usuário, para preservar o progresso existente.
- Larguras solicitadas: 375, 768 e 1440 pixels; largura útil desconta a barra de rolagem.
- Sem erros JavaScript registrados durante a execução observada.

## Cobertura

| Área | Verificações | Resultado |
|---|---|---|
| Oito casos | Coleta das três pistas, diagnóstico correto, reparo e conclusão | Aprovado |
| Energia | Testes bloqueados em estado incorreto; reparos de hardware exigem desconexão e software exige energia | Aprovado |
| Diagnóstico | Bloqueio com zero ou uma pista; resposta obrigatória; todas as 24 alternativas incorretas | Aprovado |
| Pontos | Caso perfeito: 1.000; uma dica e um erro: 750; três erros e dica: 450 | Aprovado |
| Repetição | Pista repetida não duplica; dica repetida não cobra de novo; resultado reaberto não soma; recorde inferior não substitui superior | Aprovado |
| Jornada | Progressão de níveis, próximo caso, conclusão dos oito, total máximo de 8.000 | Aprovado |
| Persistência | Recordes, pistas, erros, dica, energia, diagnóstico e conclusão após recarregar | Aprovado após correção |
| Navegação | Bancada, desafios, progresso, guia, ajuda, monitor, gabinete e retorno à investigação | Aprovado |
| Diálogos | Abertura, botão fechar, retorno e tecla Escape | Aprovado |
| Exportação | Download real do TXT e leitura do conteúdo: oito casos e total de 8.000/8.000 | Aprovado |
| Responsividade | Quatro telas nas três larguras sem transbordamento horizontal | Aprovado |
| Dados inválidos | JSON inválido, formatos errados, índices inválidos, duplicatas, pontuação inválida e compatibilidade com saves antigos | 10 testes automatizados aprovados |

## Defeitos corrigidos

1. **Fonte defeituosa ligava após acertar o diagnóstico, antes do reparo.** A condição agora mantém o computador sem ligar até a conclusão do reparo. Reteste: tentativa de ligar após diagnóstico correto continua exibindo a falha e mantém a energia desconectada.
2. **Recarregar perdia a investigação em andamento e seus descontos.** O estado completo da tentativa agora é salvo. Navegar pelo catálogo também retoma casos em andamento. Retestes confirmaram preservação de pistas, alternativas descartadas, dica, descontos, energia, diagnóstico e resultado.

O carregamento de dados salvos também foi reforçado para rejeitar chaves de casos e valores inválidos, conservar saves antigos e recalcular os descontos de forma consistente.

## Evidências e reprodução

- `browser-results.json`: lista das 147 verificações. As duas entradas com `pass: false` documentam os defeitos originais, não o estado final; os retestes aparecem como `CORRIGIDO`.
- `progresso-testado.png`: tela de progresso ao final da regressão.
- `progress.test.cjs`: executar com `node --test tests/progress.test.cjs`.

## Limites

Esta rodada cobre os fluxos disponíveis no navegador integrado. Não equivale a certificação em Safari, Firefox, aparelhos físicos ou leitor de tela. Larguras móveis foram simuladas. Falta de espaço e bloqueio real de armazenamento do navegador não foram induzidos. Não há cadastro, servidor de alunos ou painel de professor para testar nesta versão.
