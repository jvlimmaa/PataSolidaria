create type public.app_role as enum ('gestor', 'colaborador');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);

create table public.contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  nome text not null,
  email text not null,
  valor numeric(10,2) not null,
  forma text not null,
  vencimento date not null,
  created_at timestamptz not null default now()
);

create table public.bens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  item text not null,
  qtd text not null,
  doador text not null,
  data date not null,
  created_at timestamptz not null default now()
);

create table public.servicos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  quem text not null,
  o_que text not null,
  data date not null,
  horas int not null default 1,
  created_at timestamptz not null default now()
);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  contribution_id uuid references public.contributions(id) on delete cascade,
  user_id uuid,
  destinatarios text not null,
  mensagem text not null,
  sent_at timestamptz not null default now()
);

create table public.preferences (
  user_id uuid primary key,
  email boolean not null default true,
  whatsapp boolean not null default false,
  antecedencia int not null default 15
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
grant select, insert, update, delete on public.contributions to authenticated;
grant all on public.contributions to service_role;
grant select, insert, update, delete on public.bens to authenticated;
grant all on public.bens to service_role;
grant select, insert, update, delete on public.servicos to authenticated;
grant all on public.servicos to service_role;
grant select, insert on public.reminders to authenticated;
grant all on public.reminders to service_role;
grant select, insert, update on public.preferences to authenticated;
grant all on public.preferences to service_role;

alter table public.user_roles enable row level security;
alter table public.contributions enable row level security;
alter table public.bens enable row level security;
alter table public.servicos enable row level security;
alter table public.reminders enable row level security;
alter table public.preferences enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Le propria funcao"
  on public.user_roles for select to authenticated
  using (user_id = auth.uid());

create policy "Gestor ve tudo, colaborador ve o seu"
  on public.contributions for select to authenticated
  using (public.has_role(auth.uid(), 'gestor') or user_id = auth.uid());

create policy "Inserir contribuicao"
  on public.contributions for insert to authenticated
  with check (public.has_role(auth.uid(), 'gestor') or user_id = auth.uid());

create policy "Atualizar contribuicao"
  on public.contributions for update to authenticated
  using (public.has_role(auth.uid(), 'gestor') or user_id = auth.uid())
  with check (public.has_role(auth.uid(), 'gestor') or user_id = auth.uid());

create policy "Excluir contribuicao"
  on public.contributions for delete to authenticated
  using (public.has_role(auth.uid(), 'gestor'));

create policy "Gestor ve tudo, colaborador ve o seu"
  on public.bens for select to authenticated
  using (public.has_role(auth.uid(), 'gestor') or user_id = auth.uid());

create policy "Inserir bem"
  on public.bens for insert to authenticated
  with check (public.has_role(auth.uid(), 'gestor') or user_id = auth.uid());

create policy "Atualizar bem"
  on public.bens for update to authenticated
  using (public.has_role(auth.uid(), 'gestor') or user_id = auth.uid())
  with check (public.has_role(auth.uid(), 'gestor') or user_id = auth.uid());

create policy "Excluir bem"
  on public.bens for delete to authenticated
  using (public.has_role(auth.uid(), 'gestor'));

create policy "Gestor ve tudo, colaborador ve o seu"
  on public.servicos for select to authenticated
  using (public.has_role(auth.uid(), 'gestor') or user_id = auth.uid());

create policy "Inserir servico"
  on public.servicos for insert to authenticated
  with check (public.has_role(auth.uid(), 'gestor') or user_id = auth.uid());

create policy "Atualizar servico"
  on public.servicos for update to authenticated
  using (public.has_role(auth.uid(), 'gestor') or user_id = auth.uid())
  with check (public.has_role(auth.uid(), 'gestor') or user_id = auth.uid());

create policy "Excluir servico"
  on public.servicos for delete to authenticated
  using (public.has_role(auth.uid(), 'gestor'));

create policy "Gestor ve tudo, colaborador ve o seu"
  on public.reminders for select to authenticated
  using (public.has_role(auth.uid(), 'gestor') or user_id = auth.uid());

create policy "Inserir lembrete"
  on public.reminders for insert to authenticated
  with check (public.has_role(auth.uid(), 'gestor') or user_id = auth.uid());

create policy "Preferencias do proprio usuario"
  on public.preferences for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'colaborador')
  on conflict do nothing;

  insert into public.preferences (user_id)
  values (new.id)
  on conflict do nothing;

  update public.contributions
  set user_id = new.id
  where user_id is null and lower(email) = lower(coalesce(new.email, ''));

  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();