create or replace function public.accept_dealer_invite(invite_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.dealer_invitations%rowtype;
  v_user_id uuid := auth.uid();
  v_user_email text;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select email into v_user_email from public.profiles where id = v_user_id;
  if v_user_email is null then
    raise exception 'Profile email missing';
  end if;

  select * into v_invite
  from public.dealer_invitations
  where token = invite_token
  limit 1;

  if v_invite.id is null then
    raise exception 'Invalid invite';
  end if;

  if v_invite.status <> 'pending' then
    raise exception 'Invite is not pending';
  end if;

  if v_invite.expires_at < now() then
    update public.dealer_invitations
      set status = 'expired'
    where id = v_invite.id;
    raise exception 'Invite expired';
  end if;

  if lower(v_invite.email) <> lower(v_user_email) then
    raise exception 'Invite email does not match signed-in user';
  end if;

  -- Create membership if not exists
  insert into public.dealer_memberships (user_id, dealership_id, role, is_active, created_at, updated_at, created_by, updated_by)
  values (v_user_id, v_invite.dealership_id, v_invite.role, true, now(), now(), v_invite.invited_by, v_invite.invited_by)
  on conflict do nothing;

  -- Mark invite accepted
  update public.dealer_invitations
    set status = 'accepted',
        accepted_at = now(),
        accepted_by = v_user_id
  where id = v_invite.id;

  return v_invite.dealership_id;
end;
$$;

-- Allow authenticated users to execute
revoke all on function public.accept_dealer_invite(text) from public;
grant execute on function public.accept_dealer_invite(text) to authenticated;
