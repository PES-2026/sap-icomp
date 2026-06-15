frontend\src\features\scheduling\components\pending

Agora você deve colocar as ações nos botões da tela de pendentes

Confirmar
PUT /schedule/{scheduleId}/confirm

Cancelar
PUT /schedule/{scheduleId}/cancel
body: {
    reason?: "string",
}

REGRAS:
- Não olhe jamais para o /backend, trabalhe no frontend apenas com as informações que eu cedi a você.