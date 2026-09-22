import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "../src/db";

const result = await db.execute(sql`
  insert into seller_scan_grace (order_id, seller_id, grace_until)
  select o.id, o.sellers_id, now() + interval '24 hours'
  from orders o
  join "user" u on u.id = o.sellers_id
  where o.status = 'pending' and o.expires_at > now() and u.is_active
    and 'seller'::"role" = any(u.role)
    and (u.email_verified = false or u.two_factor_enabled = false or not exists (
      select 1 from sellers_profile p where p.user_id = u.id and p.is_current = true
    ))
  on conflict (order_id) do nothing
`);
console.log(`Seller scan grace snapshot created: ${result.rowCount ?? 0} orders`);
