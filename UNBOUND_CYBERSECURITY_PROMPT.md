# 🔒 Unbound — Cybersecurity Prompt para Claude Code

> **Objetivo:** Este documento é um prompt de referência para ser usado com o Claude Code em todas as sessões de desenvolvimento da Unbound. Ele define as regras de segurança obrigatórias que devem ser seguidas em cada linha de código produzida.

---

## 1. Regra Zero: Nenhuma Regra de Negócio no Frontend

O frontend é **território hostil**. Qualquer lógica que determine acesso, valores, limites, permissões ou fluxo transacional **deve existir exclusivamente no backend** (Supabase Edge Functions, RLS policies, database functions).

### O que é proibido no frontend:

- Cálculos de taxas, spreads ou valores de transação
- Verificações de permissão ou role do usuário (ex: `if (user.role === 'admin')`)
- Validações que decidem se uma ação é permitida ou não
- Lógica de limites de transação, saldos ou crédito
- Qualquer `if/else` que controle acesso a funcionalidades
- Formatação ou manipulação de dados sensíveis (CPF, chaves PIX, dados bancários)

### O que o frontend pode fazer:

- Renderizar dados que já vieram validados do backend
- Enviar inputs do usuário para o backend processar
- Exibir feedback de sucesso/erro com base na resposta do backend
- Validações de UX (campo vazio, formato de email) — **apenas para experiência do usuário, nunca como barreira de segurança**

### Regra prática:

> Se remover essa lógica do frontend quebraria a segurança do sistema, ela **não deveria estar no frontend**.

---

## 2. Política de Storage: Zero Cookies, SessionStorage Only

**Nenhum cookie deve ser criado pela aplicação.** Todo armazenamento client-side deve usar `sessionStorage`.

### Regras:

| Permitido | Proibido |
|---|---|
| `sessionStorage` | `localStorage` |
| Dados voláteis de sessão | `document.cookie` |
| Tokens temporários | Cookies de qualquer tipo |
| Estado de UI da sessão atual | Persistência entre sessões |

### Comportamento obrigatório:

- **Ao fechar a aba/navegador:** todo o `sessionStorage` é automaticamente limpo pelo browser
- **Ao fazer logout:** executar `sessionStorage.clear()` explicitamente antes de redirecionar
- **Tokens de autenticação:** armazenados apenas em `sessionStorage`, nunca em `localStorage` ou cookies
- **Dados sensíveis (CPF, dados bancários):** **nunca** armazenados no client-side, nem mesmo em `sessionStorage`

### Implementação padrão de logout:

```typescript
function logout() {
  sessionStorage.clear();
  // Limpar qualquer estado em memória
  window.location.href = '/login';
}
```

### Listener obrigatório para limpeza:

```typescript
// Garantir limpeza ao fechar sessão
window.addEventListener('beforeunload', () => {
  sessionStorage.clear();
});
```

---

## 3. Isolamento de Usuário: Cada Um Só Acessa o Seu

Nenhum usuário pode visualizar, editar ou deletar dados de outro usuário. Isso deve ser garantido em **todas as camadas**.

### No Supabase (RLS obrigatório):

Toda query deve ser filtrada automaticamente pelo `auth.uid()`. O usuário **nunca** passa seu próprio ID como parâmetro — o backend extrai do token.

```sql
-- EXEMPLO: Policy de SELECT
CREATE POLICY "users_select_own" ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);

-- EXEMPLO: Policy de UPDATE
CREATE POLICY "users_update_own" ON transactions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- EXEMPLO: Policy de DELETE
CREATE POLICY "users_delete_own" ON transactions
  FOR DELETE
  USING (auth.uid() = user_id);

-- EXEMPLO: Policy de INSERT
CREATE POLICY "users_insert_own" ON transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### No Frontend:

- **Nunca** passar `user_id` como parâmetro de API — o backend extrai do token JWT
- **Nunca** construir queries com ID do usuário vindo do client
- **Nunca** expor IDs de outros usuários em responses da API

### Nas Edge Functions:

```typescript
// CORRETO — extrair do token
const { data: { user } } = await supabase.auth.getUser();
const userId = user.id;

// PROIBIDO — receber do client
const userId = req.body.userId; // ❌ NUNCA
```

---

## 4. Rotas: Whitelist Estrita de Paths

A aplicação deve ter **apenas** as rotas abaixo. Qualquer path fora dessa lista deve redirecionar para `/login` (se não autenticado) ou `/dashboard` (se autenticado).

### Rotas públicas (sem autenticação):

```
/login
```

### Rotas protegidas (requerem autenticação):

```
/dashboard
/receive
/send
/transactions
/settings
```

### Regras de roteamento:

- **Rota inexistente + não autenticado** → redireciona para `/login`
- **Rota inexistente + autenticado** → redireciona para `/dashboard`
- **Rota protegida + não autenticado** → redireciona para `/login`
- **Nenhuma rota dinâmica com IDs expostos** (ex: `/users/123` é proibido)
- **Nenhum path com query params sensíveis** (ex: `?token=xxx` é proibido)

### Implementação no Next.js (middleware):

```typescript
// middleware.ts
const PUBLIC_ROUTES = ['/login'];
const PROTECTED_ROUTES = ['/dashboard', '/receive', '/send', '/transactions', '/settings'];
const ALL_VALID_ROUTES = [...PUBLIC_ROUTES, ...PROTECTED_ROUTES];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = /* verificar sessão */;

  // Rota inválida
  if (!ALL_VALID_ROUTES.includes(pathname)) {
    return NextResponse.redirect(
      new URL(isAuthenticated ? '/dashboard' : '/login', request.url)
    );
  }

  // Rota protegida sem auth
  if (PROTECTED_ROUTES.includes(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Rota pública com auth
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
```

---

## 5. Auditoria Completa de RLS — Todas as Tabelas

**Toda tabela no Supabase deve ter RLS habilitado.** Sem exceção.

### Checklist obrigatório antes de cada deploy:

```sql
-- EXECUTAR ESTA QUERY PARA ENCONTRAR TABELAS SEM RLS
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false;
```

> **Se essa query retornar qualquer resultado, o deploy está BLOQUEADO.**

### Para cada tabela, verificar:

- [ ] RLS está **habilitado** (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`)
- [ ] Existe policy de **SELECT** filtrando por `auth.uid()`
- [ ] Existe policy de **INSERT** com `WITH CHECK` validando `auth.uid()`
- [ ] Existe policy de **UPDATE** com `USING` e `WITH CHECK` validando `auth.uid()`
- [ ] Existe policy de **DELETE** filtrando por `auth.uid()`
- [ ] **Nenhuma policy** usa `TO public` ou `FOR ALL` sem filtro
- [ ] Tabelas de configuração/sistema usam `TO service_role` apenas

### Policies perigosas — buscar e eliminar:

```sql
-- ENCONTRAR policies permissivas demais
SELECT schemaname, tablename, policyname, permissive, roles, qual
FROM pg_policies
WHERE qual = 'true' OR qual IS NULL;
```

> **Qualquer policy com `USING (true)` em tabela com dados de usuário é uma vulnerabilidade crítica.**

### Template padrão para novas tabelas:

```sql
-- Ao criar QUALQUER nova tabela:
CREATE TABLE nova_tabela (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL DEFAULT auth.uid(),
  -- ... demais colunas
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SEMPRE habilitar RLS
ALTER TABLE nova_tabela ENABLE ROW LEVEL SECURITY;

-- SEMPRE criar as 4 policies
CREATE POLICY "select_own" ON nova_tabela FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own" ON nova_tabela FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own" ON nova_tabela FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own" ON nova_tabela FOR DELETE USING (auth.uid() = user_id);
```

---

## 6. Resumo: Regras Invioláveis

| # | Regra | Severidade |
|---|---|---|
| 1 | Zero lógica de negócio no frontend | Crítica |
| 2 | Zero cookies — apenas `sessionStorage` | Crítica |
| 3 | `sessionStorage.clear()` no logout e no `beforeunload` | Crítica |
| 4 | Usuário só acessa dados próprios via `auth.uid()` | Crítica |
| 5 | Whitelist estrita de rotas — paths fixos apenas | Alta |
| 6 | RLS habilitado em 100% das tabelas, sem exceção | Crítica |
| 7 | Nunca receber `user_id` do client — sempre extrair do token | Crítica |
| 8 | Nenhuma policy com `USING (true)` em tabelas de usuário | Crítica |
| 9 | Dados sensíveis nunca no client-side | Crítica |
| 10 | Nenhuma rota dinâmica com IDs na URL | Alta |

---

## Como Usar Este Prompt

Cole o conteúdo deste arquivo no início de qualquer sessão do Claude Code relacionada ao desenvolvimento da Unbound. Ao iniciar a sessão, instrua:

```
Leia o arquivo UNBOUND_CYBERSECURITY_PROMPT.md e siga todas as regras
de segurança definidas nele durante toda esta sessão. Antes de escrever
qualquer código, verifique se ele está em conformidade com cada uma das
6 seções do documento.
```

---

*Última atualização: Março 2026 — Unbound Security Team*
