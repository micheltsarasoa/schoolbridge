import { createClient } from '@supabase/supabase-js';
import { startServer, stdio } from "@modelcontextprotocol/sdk";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const mcp = {
  async query(params) {
    const { table, filter } = params;
    let q = supabase.from(table).select('*');

    if (filter) q = q.match(filter);

    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return data;
  }
};

startServer(
  {
    query: {
      params: {
        table: "string",
        filter: "object?"
      },
      returns: "array"
    }
  },
  mcp,
  stdio()
);
